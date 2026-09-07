import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, RefreshCw, Play, SkipForward, Swords } from 'lucide-react';
import { db } from '../db';
import CARTES from '../donnees/duel-vocabulaire.json';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « DUEL DE VOCABULAIRE »
   ──────────────────────────────────────────────────────────────────
   • Catégories dans ../donnees/duel-vocabulaire.json (schéma : id,
     categorie [en espagnol], traduction [en français]).
   • Comme pour Tabou : tirer une carte ("Lancer" ou "Passer") ne
     marque rien — la carte reste disponible pour un tirage ultérieur.
     Une carte n'est marquée "faite" (table Dexie `duelCartesFaites`,
     clé = id de la carte) que lorsqu'un gagnant est déclaré pour elle,
     ce qui tire aussitôt la carte suivante.
   • Score de Martin/Chryséis compté à part (table `duelScores`, clé =
     nom du joueur) — indépendant du deck de cartes : "Réinitialiser
     les cartes" et "Réinitialiser les scores" sont deux actions
     séparées, l'une ne touche jamais l'autre.
     À ajouter au schéma db.js si absent (nouvelle version, comme pour
     tabouFait) :
       duelCartesFaites: 'id, date',
       duelScores: 'joueur'
   ════════════════════════════════════════════════════════════════════ */

function Entete() {
  return (
    <div className="relative px-5 pt-5 pb-1">
      <Link to="/jeux/mini-jeux" aria-label="Retour"
            className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
        <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
      </Link>
      <h1 className="font-serif uppercase tracking-[2px] text-[22px] text-encre font-semibold text-center -mt-6 px-8">Duelo de vocabulario</h1>
    </div>
  );
}

function JaugeScore({ martin, chryseis, onReinitialiser }) {
  const total = martin + chryseis;
  const pctMartin = total > 0 ? (martin / total) * 100 : 50;
  return (
    <div className="relative px-5 pt-4">
      <div className="flex items-center justify-between text-[12px] text-encre-douce mb-1.5">
        <span className="font-semibold">Martin — {martin}</span>
        <button onClick={onReinitialiser} className="text-[10.5px] font-semibold text-sepia">
          Réinitialiser les scores
        </button>
        <span className="font-semibold">Chryséis — {chryseis}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden flex bg-parchemin-bordure">
        <div className="h-full bg-jeu-minijeux transition-all duration-300" style={{ width: `${pctMartin}%` }} />
        <div className="h-full bg-terra-500 transition-all duration-300" style={{ width: `${100 - pctMartin}%` }} />
      </div>
    </div>
  );
}

function CarteDuel({ carte }) {
  return (
    <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl shadow-[0_4px_12px_rgba(60,40,20,0.12)] p-8 text-center">
      <p className="font-serif text-[26px] text-encre font-semibold leading-tight">{carte.categorie}</p>
      {carte.traduction && <p className="text-[13px] text-encre-douce mt-2">{carte.traduction}</p>}
    </div>
  );
}

export default function DuelVocabulaire() {
  const [courante, setCourante] = useState(null);

  const faitesDB = useLiveQuery(() => db.duelCartesFaites.toArray(), []) ?? [];
  const faitesIds = useMemo(() => new Set(faitesDB.map((f) => f.id)), [faitesDB]);

  const scoresDB = useLiveQuery(() => db.duelScores.toArray(), []) ?? [];
  const martin = scoresDB.find((s) => s.joueur === 'martin')?.score ?? 0;
  const chryseis = scoresDB.find((s) => s.joueur === 'chryseis')?.score ?? 0;

  const total = CARTES.length;
  const restantes = total - faitesIds.size;

  const poolTirage = useMemo(
    () => CARTES.filter((c) => !faitesIds.has(c.id)),
    [faitesIds]
  );

  function lancer() {
    if (poolTirage.length === 0) {
      setCourante(null);
      return;
    }
    const carte = poolTirage[Math.floor(Math.random() * poolTirage.length)];
    setCourante(carte);
  }

  function passer() {
    const candidats = poolTirage.filter((c) => c.id !== courante?.id);
    const source = candidats.length ? candidats : poolTirage;
    if (source.length === 0) {
      setCourante(null);
      return;
    }
    const carte = source[Math.floor(Math.random() * source.length)];
    setCourante(carte);
  }

  function declarerGagnant(joueur) {
    if (!courante) return;
    const carteTerminee = courante;
    const scoreActuel = joueur === 'martin' ? martin : chryseis;

    const candidats = poolTirage.filter((c) => c.id !== carteTerminee.id);
    const prochaine = candidats.length > 0
      ? candidats[Math.floor(Math.random() * candidats.length)]
      : null;
    setCourante(prochaine);

    try {
      db.duelCartesFaites.put({ id: carteTerminee.id, date: new Date().toISOString() })
        .catch((err) => console.error('Erreur en enregistrant la carte du duel :', err));
      db.duelScores.put({ joueur, score: scoreActuel + 1 })
        .catch((err) => console.error('Erreur en enregistrant le score du duel :', err));
    } catch (err) {
      console.error('Erreur en enregistrant le duel :', err);
    }
  }

  function reinitialiserCartes() {
    setCourante(null);
    try {
      db.duelCartesFaites.bulkDelete(CARTES.map((c) => c.id))
        .catch((err) => console.error('Erreur en réinitialisant le duel :', err));
    } catch (err) {
      console.error('Erreur en réinitialisant le duel :', err);
    }
  }

  function reinitialiserScores() {
    try {
      db.duelScores.bulkDelete(['martin', 'chryseis'])
        .catch((err) => console.error('Erreur en réinitialisant les scores du duel :', err));
    } catch (err) {
      console.error('Erreur en réinitialisant les scores du duel :', err);
    }
  }

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />
      <Entete />

      <JaugeScore martin={martin} chryseis={chryseis} onReinitialiser={reinitialiserScores} />

      {/* Compteur + réinitialiser (cartes uniquement, pas les scores) */}
      <div className="relative px-5 pt-4">
        <div className="flex items-center justify-between text-[12px] text-encre-douce">
          <span>{restantes} / {total} mots restants</span>
          <button onClick={reinitialiserCartes}
                  className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-sepia">
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />Réinitialiser les cartes
          </button>
        </div>
      </div>

      {/* Corps */}
      <div className="relative px-5 pt-5 pb-6">
        {!courante ? (
          poolTirage.length === 0 ? (
            <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
              <p className="text-[13px] text-encre-douce leading-snug">Toutes les cartes ont été tirées ! Réinitialise pour rejouer.</p>
            </div>
          ) : (
            <div className="flex justify-center pt-4">
              <button onClick={lancer}
                      className="inline-flex items-center gap-2 bg-vert-cta text-creme font-semibold text-[13.5px] rounded-full px-6 py-3.5 shadow-[0_8px_18px_rgba(35,64,52,0.35)]">
                <Play className="w-4 h-4" strokeWidth={2} fill="currentColor" />Lancer une carte
              </button>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-5">
            <CarteDuel carte={courante} />

            <div className="flex justify-center">
              <button onClick={passer}
                      className="inline-flex items-center gap-2 bg-parchemin-carte border border-parchemin-bordure text-encre-douce font-semibold text-[13px] rounded-full px-5 py-2.5">
                <SkipForward className="w-3.5 h-3.5" strokeWidth={2} />Passer
              </button>
            </div>

            {/* Qui a gagné cette manche ? */}
            <div className="flex flex-col gap-2">
              <p className="text-center text-[11px] uppercase tracking-wide text-sepia font-semibold">Qui a gagné ?</p>
              <div className="flex gap-3">
                <button onClick={() => declarerGagnant('martin')}
                        className="flex-1 bg-parchemin-carte border border-parchemin-bordure text-encre font-semibold text-[13.5px] rounded-full py-2.5">
                  Martin
                </button>
                <button onClick={() => declarerGagnant('chryseis')}
                        className="flex-1 bg-parchemin-carte border border-parchemin-bordure text-encre font-semibold text-[13.5px] rounded-full py-2.5">
                  Chryséis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}