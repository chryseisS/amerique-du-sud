import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, BarChart3, CalendarClock, Delete, X } from 'lucide-react';
import { db } from '../db';
import {
  ACCEPTES, ESSAIS_MAX, LONGUEUR, SOLUTIONS,
  etatClavier, evaluer, formaterDate, indexAujourdhui,
  joursARattraper, solutionDuJour, statistiques, traductionDe,
} from '../wordleLogique';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « WORDLE »
   ──────────────────────────────────────────────────────────────────
   • /jeux/mini-jeux/wordle           → mot du jour
   • /jeux/mini-jeux/wordle/jour/:n   → jour n°n (rattrapage)
   • Liste des jours à rattraper : WordleRattrapage.jsx
   • Logique (mot du jour, couleurs, stats) : ../wordleLogique.js
   • Mots : ../donnees/wordle-mots.json (solutions, thème Amérique du
     Sud) et ../donnees/wordle-acceptes.json (tous les mots valides).
   • Une partie par jour dans Dexie, enregistrée après chaque essai
     (on peut quitter en cours de partie et reprendre).
     À ajouter à db.js (NOUVELLE version) :
       wordleParties: 'index'
   ════════════════════════════════════════════════════════════════════ */

const CLAVIER = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['ENVIAR', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BORRAR'],
];

const COULEUR_CASE = {
  juste: 'bg-vert-cta border-vert-cta text-creme',
  present: 'bg-jeu-minijeux border-jeu-minijeux text-creme',
  absent: 'bg-[#8c7f6e] border-[#8c7f6e] text-creme',
};

const COULEUR_TOUCHE = {
  juste: 'bg-vert-cta text-creme',
  present: 'bg-jeu-minijeux text-creme',
  absent: 'bg-[#8c7f6e]/70 text-creme',
};

// ─── En-tête ──────────────────────────────────────────────────────────

function Entete({ retour, sousTitre, nbRattrapage, onStats }) {
  return (
    <div className="relative px-5 pt-5 pb-1">
      <div className="flex items-center justify-between">
        <Link to={retour} aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <div className="flex items-center gap-2">
          {nbRattrapage > 0 && (
            <Link to="/jeux/mini-jeux/wordle/rattrapage" aria-label="Mots à rattraper"
                  className="relative inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
              <CalendarClock className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-terra-500 text-creme text-[10px] font-bold flex items-center justify-center">
                {nbRattrapage}
              </span>
            </Link>
          )}
          <button onClick={onStats} aria-label="Statistiques"
                  className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
            <BarChart3 className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
          </button>
        </div>
      </div>
      <h1 className="font-serif uppercase tracking-[2px] text-[25px] text-encre font-semibold text-center -mt-8">Wordle</h1>
      <p className="text-center text-[12.5px] text-sepia mt-0.5 first-letter:uppercase">{sousTitre}</p>
    </div>
  );
}

// ─── Statistiques (fenêtre) ──────────────────────────────────────────

function FenetreStats({ stats, essaisGagnants, onFermer }) {
  const max = Math.max(1, ...stats.distribution);
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-6" onClick={onFermer}>
      <div className="relative bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 w-full max-w-[340px] shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
           onClick={(e) => e.stopPropagation()}>
        <button onClick={onFermer} aria-label="Fermer" className="absolute top-3 right-3 text-encre-douce">
          <X className="w-5 h-5" strokeWidth={2} />
        </button>
        <p className="font-serif text-[17px] text-encre font-semibold text-center mb-4">Statistiques</p>

        <div className="grid grid-cols-4 gap-1 text-center mb-5">
          {[
            [stats.jouees, 'Jouées'],
            [`${stats.pourcentage}%`, 'Victoires'],
            [stats.serie, 'Série'],
            [stats.meilleure, 'Record'],
          ].map(([val, lib]) => (
            <div key={lib}>
              <p className="font-serif text-[24px] text-encre font-bold leading-none">{val}</p>
              <p className="text-[10px] text-encre-douce mt-1">{lib}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] uppercase tracking-wider text-sepia font-semibold mb-2">Répartition des essais</p>
        <div className="flex flex-col gap-1.5">
          {stats.distribution.map((n, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px]">
              <span className="w-3 text-encre-douce font-semibold">{i + 1}</span>
              <div className="flex-1">
                <div className={`h-5 rounded-md flex items-center justify-end px-1.5 text-[11px] font-bold text-creme ${essaisGagnants === i + 1 ? 'bg-vert-cta' : 'bg-[#8c7f6e]'}`}
                     style={{ width: `${Math.max(8, (n / max) * 100)}%` }}>
                  {n}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10.5px] text-encre-douce/70 mt-4 leading-snug">
          La série compte les jours du calendrier : un mot rattrapé plus tard compte pour son jour.
        </p>
      </div>
    </div>
  );
}

// ─── Grille ───────────────────────────────────────────────────────────

function Grille({ essais, saisie, solution, ligneRevelee, ligneSecouee }) {
  const lignes = [];
  for (let r = 0; r < ESSAIS_MAX; r++) {
    const essai = essais[r];
    const estSaisie = r === essais.length;
    const lettres = essai ?? (estSaisie ? saisie : '');
    const eval_ = essai ? evaluer(essai, solution) : null;

    lignes.push(
      <div key={r} ref={estSaisie ? ligneSecouee : undefined}
           className="flex gap-1.5 justify-center">
        {Array.from({ length: LONGUEUR }).map((_, c) => {
          const lettre = lettres[c] ?? '';
          const style = eval_
            ? COULEUR_CASE[eval_[c]]
            : lettre
              ? 'bg-parchemin-carte border-encre-douce/60 text-encre'
              : 'bg-[rgba(255,250,235,0.5)] border-parchemin-bordure text-encre';
          const anime = r === ligneRevelee;
          return (
            <div key={c}
                 className={`w-[54px] h-[54px] border-2 rounded-lg flex items-center justify-center font-serif text-[26px] font-bold uppercase ${style}`}
                 style={anime ? { animation: `wordle-retourner 450ms ease ${c * 140}ms both` } : undefined}>
              {lettre}
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <>
      <style>{`
        @keyframes wordle-retourner {
          0% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
      `}</style>
      <div className="flex flex-col gap-1.5">{lignes}</div>
    </>
  );
}

// ─── Clavier ──────────────────────────────────────────────────────────

function Clavier({ etat, onTouche }) {
  return (
    <div className="flex flex-col gap-1.5 px-2">
      {CLAVIER.map((rangee, i) => (
        <div key={i} className="flex gap-1 justify-center">
          {rangee.map((t) => {
            const large = t === 'ENVIAR' || t === 'BORRAR';
            const couleur = etat[t] ? COULEUR_TOUCHE[etat[t]] : 'bg-parchemin-carte text-encre border border-parchemin-bordure';
            return (
              <button key={t} onClick={() => onTouche(t)}
                      aria-label={t === 'BORRAR' ? 'Effacer' : t === 'ENVIAR' ? 'Valider' : t}
                      className={`${large ? 'flex-[1.6] max-w-[64px] text-[10.5px]' : 'flex-1 max-w-[42px] text-[15px]'} h-12 rounded-md font-semibold flex items-center justify-center active:scale-95 transition-transform ${couleur}`}>
                {t === 'BORRAR' ? <Delete className="w-5 h-5" strokeWidth={2} /> : t}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Une partie (un jour) ────────────────────────────────────────────

function Partie({ index, aujourdhui, parties }) {
  const navigate = useNavigate();
  const partie = parties.find((p) => p.index === index);
  const solution = partie?.mot ?? solutionDuJour(index)?.mot;

  const [essaisLocaux, setEssaisLocaux] = useState(null); // mise à jour immédiate, avant Dexie
  const [saisie, setSaisie] = useState('');
  const [message, setMessage] = useState('');
  const [ligneRevelee, setLigneRevelee] = useState(-1);
  const [statsOuvertes, setStatsOuvertes] = useState(false);
  const ligneSaisie = useRef(null);

  const essais = essaisLocaux ?? partie?.essais ?? [];
  const gagne = essais.length > 0 && essais[essais.length - 1] === solution;
  const perdu = !gagne && essais.length >= ESSAIS_MAX;
  const fini = gagne || perdu;

  const aRattraper = joursARattraper(parties, aujourdhui).filter((j) => j.index !== index);
  const stats = statistiques(parties, aujourdhui);
  const etat = etatClavier(essais, solution);
  const estRattrapage = index < aujourdhui;

  // Message temporaire
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 1800);
    return () => clearTimeout(t);
  }, [message]);

  // Ouvre les stats à la fin d'une partie jouée à l'instant
  useEffect(() => {
    if (fini && ligneRevelee >= 0) {
      const t = setTimeout(() => setStatsOuvertes(true), 1500);
      return () => clearTimeout(t);
    }
  }, [fini, ligneRevelee]);

  function secouer(texte) {
    setMessage(texte);
    ligneSaisie.current?.animate(
      [
        { transform: 'translateX(0)' }, { transform: 'translateX(-7px)' },
        { transform: 'translateX(7px)' }, { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' }, { transform: 'translateX(0)' },
      ],
      { duration: 380 }
    );
  }

  const valider = useCallback(() => {
    if (saisie.length < LONGUEUR) return secouer('Pas assez de lettres');
    if (!ACCEPTES.has(saisie)) return secouer('Mot inconnu');

    const nouveaux = [...essais, saisie];
    const statut = saisie === solution ? 'gagne' : nouveaux.length >= ESSAIS_MAX ? 'perdu' : 'en-cours';
    setEssaisLocaux(nouveaux);
    setLigneRevelee(nouveaux.length - 1);
    setSaisie('');

    try {
      db.wordleParties.put({ index, mot: solution, essais: nouveaux, statut, date: new Date().toISOString() })
        .catch((err) => console.error('Erreur en enregistrant la partie Wordle :', err));
    } catch (err) {
      console.error('Erreur en enregistrant la partie Wordle :', err);
    }
  }, [saisie, essais, solution, index]);

  const toucher = useCallback((t) => {
    if (fini) return;
    if (t === 'ENVIAR') return valider();
    if (t === 'BORRAR') return setSaisie((s) => s.slice(0, -1));
    setSaisie((s) => (s.length < LONGUEUR ? s + t : s));
  }, [fini, valider]);

  // Clavier physique (ordinateur)
  useEffect(() => {
    function surTouche(e) {
      if (statsOuvertes || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Enter') toucher('ENVIAR');
      else if (e.key === 'Backspace') toucher('BORRAR');
      else {
        const l = e.key.toUpperCase();
        if (/^[A-ZÑ]$/.test(l)) toucher(l);
      }
    }
    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, [toucher, statsOuvertes]);

  const traduction = traductionDe(solution);

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />
      <Entete
        retour={estRattrapage ? '/jeux/mini-jeux/wordle/rattrapage' : '/jeux/mini-jeux'}
        sousTitre={estRattrapage ? `Rattrapage · ${formaterDate(index)}` : formaterDate(index)}
        nbRattrapage={estRattrapage ? 0 : aRattraper.length}
        onStats={() => setStatsOuvertes(true)}
      />

      <div className="relative h-8 flex items-center justify-center">
        {message && (
          <span className="bg-encre text-creme text-[12.5px] font-semibold rounded-full px-4 py-1.5 shadow-md">{message}</span>
        )}
      </div>

      <div className="relative px-4">
        <Grille essais={essais} saisie={saisie} solution={solution}
                ligneRevelee={ligneRevelee} ligneSecouee={ligneSaisie} />
      </div>

      <div className="relative pt-5 pb-6">
        {!fini ? (
          <Clavier etat={etat} onTouche={toucher} />
        ) : (
          <div className="px-5">
            <div className={`rounded-2xl px-4 py-4 text-center border ${gagne ? 'bg-vert-cta/10 border-vert-cta/40' : 'bg-terra-500/10 border-terra-500/40'}`}>
              <p className={`font-serif text-[17px] font-semibold ${gagne ? 'text-vert-cta' : 'text-terra-500'}`}>
                {gagne ? `¡Muy bien! Trouvé en ${essais.length} essai${essais.length > 1 ? 's' : ''}` : 'Pas cette fois…'}
              </p>
              <p className="font-serif text-[26px] tracking-[4px] text-encre font-bold mt-1">{solution}</p>
              {traduction && <p className="text-[12.5px] text-encre-douce mt-0.5">{traduction}</p>}
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => setStatsOuvertes(true)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-parchemin-carte border border-parchemin-bordure text-encre-douce font-semibold text-[12.5px] rounded-full py-2.5">
                <BarChart3 className="w-4 h-4" strokeWidth={2} />Statistiques
              </button>
              {aRattraper.length > 0 && (
                <button onClick={() => navigate(`/jeux/mini-jeux/wordle/jour/${aRattraper[0].index}`)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-vert-cta text-creme font-semibold text-[12.5px] rounded-full py-2.5">
                  <CalendarClock className="w-4 h-4" strokeWidth={2} />
                  Rattraper ({aRattraper.length})
                </button>
              )}
            </div>
            {!estRattrapage && aRattraper.length === 0 && (
              <p className="text-[11.5px] text-encre-douce text-center mt-3">Prochain mot demain !</p>
            )}
          </div>
        )}
      </div>

      {statsOuvertes && (
        <FenetreStats stats={stats} essaisGagnants={gagne ? essais.length : null} onFermer={() => setStatsOuvertes(false)} />
      )}
    </div>
  );
}

// ─── Écran ────────────────────────────────────────────────────────────

export default function Wordle() {
  const { index: param } = useParams();
  const parties = useLiveQuery(() => db.wordleParties.toArray(), []);
  const aujourdhui = indexAujourdhui();

  // Attendre Dexie avant d'afficher (sinon une partie en cours
  // apparaîtrait vide une fraction de seconde)
  if (parties === undefined) return null;

  const index = param === undefined ? aujourdhui : Number(param);

  // Un "jour" de rattrapage doit être dans le passé
  if (param !== undefined && (!Number.isInteger(index) || index < 0 || index >= aujourdhui)) {
    return <Navigate to="/jeux/mini-jeux/wordle" replace />;
  }

  if (aujourdhui < 0 || SOLUTIONS.length === 0) {
    return (
      <div className="fond-carte relative min-h-full overflow-hidden">
        <div className="vignette-carte" aria-hidden="true" />
        <Entete retour="/jeux/mini-jeux" sousTitre="" nbRattrapage={0} onStats={() => {}} />
        <div className="relative px-5 pt-6">
          <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center">
            <p className="text-[13px] text-encre-douce">
              {SOLUTIONS.length === 0
                ? 'Aucun mot pour l’instant — ajoute des mots dans wordle-mots.json.'
                : `Le premier mot arrive le ${formaterDate(0)}.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // `key` : repart d'un état propre à chaque changement de jour
  return <Partie key={index} index={index} aujourdhui={aujourdhui} parties={parties} />;
}
