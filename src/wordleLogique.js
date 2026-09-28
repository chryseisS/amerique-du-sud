import MOTS_BRUTS from './donnees/wordle-mots.json';
import ACCEPTES_BRUTS from './donnees/wordle-acceptes.json';

/* ════════════════════════════════════════════════════════════════════
   WORDLE — logique partagée (Wordle.jsx, WordleRattrapage.jsx)
   ──────────────────────────────────────────────────────────────────
   • DATE_DEBUT = jour n°0. Le mot du jour n°i est le i-ème mot de
     wordle-mots.json (en boucle si la liste est plus courte que le
     nombre de jours écoulés). À fixer UNE FOIS avant de vraiment
     commencer à jouer (la changer ensuite décale tous les jours).
   • Ajouter des mots À LA FIN de wordle-mots.json ne change pas les
     mots des jours passés (tant que la liste n'a pas encore bouclé).
     Et de toute façon, chaque partie commencée enregistre son mot dans
     Dexie : l'historique reste juste même si tu modifies la liste.
   • Les mots sont normalisés : majuscules, accents retirés, Ñ gardé.
     Tu peux donc écrire "tucán" ou "TUCAN" dans les JSON.
   • Les mots-solutions sont automatiquement ajoutés aux mots acceptés
     (pas besoin de les dupliquer dans wordle-acceptes.json).
   ════════════════════════════════════════════════════════════════════ */

export const DATE_DEBUT = '2026-09-27';
export const LONGUEUR = 5;
export const ESSAIS_MAX = 6;

export function normaliser(mot) {
  return String(mot)
    .toUpperCase()
    .replace(/Ñ/g, '\u0000')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\u0000/g, 'Ñ');
}

const VALIDE = /^[A-ZÑ]+$/;

// Solutions : accepte "mot" en chaîne ou { mot, traduction }
export const SOLUTIONS = MOTS_BRUTS
  .map((m) => (typeof m === 'string' ? { mot: m } : m))
  .map((m) => ({ ...m, mot: normaliser(m.mot) }))
  .filter((m) => {
    const ok = m.mot.length === LONGUEUR && VALIDE.test(m.mot);
    if (!ok) console.warn(`Wordle : "${m.mot}" ignoré (pas ${LONGUEUR} lettres)`);
    return ok;
  });

export const ACCEPTES = new Set([
  ...ACCEPTES_BRUTS.map(normaliser).filter((m) => m.length === LONGUEUR),
  ...SOLUTIONS.map((s) => s.mot),
]);

// ─── Jours ───────────────────────────────────────────────────────────
// Calculé sur la date LOCALE (pas UTC), pour que le jour change à
// minuit chez toi et pas à 2h du matin.
function numeroJour(date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

const [A, M, J] = DATE_DEBUT.split('-').map(Number);
const JOUR_ZERO = numeroJour(new Date(A, M - 1, J));

export function indexAujourdhui() {
  return numeroJour(new Date()) - JOUR_ZERO;
}

export function dateDuJour(index) {
  return new Date(A, M - 1, J + index);
}

export function formaterDate(index, options = { weekday: 'long', day: 'numeric', month: 'long' }) {
  return dateDuJour(index).toLocaleDateString('fr-FR', options);
}

export function solutionDuJour(index) {
  if (SOLUTIONS.length === 0 || index < 0) return null;
  return SOLUTIONS[index % SOLUTIONS.length];
}

export function traductionDe(mot) {
  return SOLUTIONS.find((s) => s.mot === mot)?.traduction;
}

// ─── Couleurs ────────────────────────────────────────────────────────
// 'juste' = bonne lettre bonne place, 'present' = ailleurs dans le mot,
// 'absent'. Deux passes pour gérer correctement les lettres en double.
export function evaluer(essai, solution) {
  const resultat = Array(LONGUEUR).fill('absent');
  const restantes = {};
  for (let i = 0; i < LONGUEUR; i++) {
    if (essai[i] === solution[i]) resultat[i] = 'juste';
    else restantes[solution[i]] = (restantes[solution[i]] ?? 0) + 1;
  }
  for (let i = 0; i < LONGUEUR; i++) {
    if (resultat[i] === 'juste') continue;
    if (restantes[essai[i]] > 0) {
      resultat[i] = 'present';
      restantes[essai[i]]--;
    }
  }
  return resultat;
}

const RANG = { absent: 1, present: 2, juste: 3 };

// Meilleur état connu de chaque lettre, pour colorer le clavier
export function etatClavier(essais, solution) {
  const etat = {};
  for (const essai of essais) {
    evaluer(essai, solution).forEach((e, i) => {
      const l = essai[i];
      if (!etat[l] || RANG[e] > RANG[etat[l]]) etat[l] = e;
    });
  }
  return etat;
}

// ─── Statistiques ────────────────────────────────────────────────────
// La série se compte sur les jours du CALENDRIER : un jour rattrapé
// plus tard compte comme s'il avait été joué le jour même.
export function statistiques(parties, aujourdhui) {
  const parIndex = new Map(parties.map((p) => [p.index, p]));
  const terminees = parties.filter((p) => p.statut === 'gagne' || p.statut === 'perdu');
  const gagnees = terminees.filter((p) => p.statut === 'gagne');

  const distribution = Array(ESSAIS_MAX).fill(0);
  gagnees.forEach((p) => { distribution[p.essais.length - 1]++; });

  // Série en cours : depuis aujourd'hui s'il est terminé, sinon depuis hier
  const pAujourdhui = parIndex.get(aujourdhui);
  let k = pAujourdhui && pAujourdhui.statut !== 'en-cours' ? aujourdhui : aujourdhui - 1;
  let serie = 0;
  while (k >= 0 && parIndex.get(k)?.statut === 'gagne') { serie++; k--; }

  let meilleure = 0;
  let courante = 0;
  for (let i = 0; i <= aujourdhui; i++) {
    if (parIndex.get(i)?.statut === 'gagne') { courante++; meilleure = Math.max(meilleure, courante); }
    else courante = 0;
  }

  return {
    jouees: terminees.length,
    pourcentage: terminees.length ? Math.round((gagnees.length / terminees.length) * 100) : 0,
    serie,
    meilleure,
    distribution,
  };
}

// Jours passés pas encore terminés (jamais joués, ou commencés)
export function joursARattraper(parties, aujourdhui) {
  const terminees = new Set(
    parties.filter((p) => p.statut === 'gagne' || p.statut === 'perdu').map((p) => p.index)
  );
  const enCours = new Set(parties.filter((p) => p.statut === 'en-cours').map((p) => p.index));
  const jours = [];
  for (let i = aujourdhui - 1; i >= 0; i--) {
    if (!terminees.has(i)) jours.push({ index: i, commence: enCours.has(i) });
  }
  return jours;
}
