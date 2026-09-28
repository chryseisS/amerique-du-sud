import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ChevronRight, CalendarClock } from 'lucide-react';
import { db } from '../db';
import { formaterDate, indexAujourdhui, joursARattraper } from '../wordleLogique';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « WORDLE — RATTRAPAGE »  — route /jeux/mini-jeux/wordle/rattrapage
   ──────────────────────────────────────────────────────────────────
   Tous les jours passés dont le mot n'a pas été terminé (jamais joué,
   ou commencé puis abandonné), du plus récent au plus ancien. Pas de
   plafond : un jour manqué reste disponible indéfiniment.
   ════════════════════════════════════════════════════════════════════ */

export default function WordleRattrapage() {
  const parties = useLiveQuery(() => db.wordleParties.toArray(), []);
  if (parties === undefined) return null;

  const jours = joursARattraper(parties, indexAujourdhui());

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux/mini-jeux/wordle" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[24px] text-encre font-semibold text-center -mt-6">Rattrapage</h1>
        <p className="text-center text-[12.5px] text-sepia mt-0.5">
          {jours.length === 0 ? 'Tout est à jour' : `${jours.length} mot${jours.length > 1 ? 's' : ''} en attente`}
        </p>
      </div>

      <div className="relative px-[18px] pt-4 pb-6 flex flex-col gap-2.5">
        {jours.length === 0 ? (
          <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
            <p className="text-[13px] text-encre-douce leading-snug">Aucun mot à rattraper. Reviens demain pour le prochain !</p>
          </div>
        ) : (
          jours.map(({ index, commence }) => (
            <Link key={index} to={`/jeux/mini-jeux/wordle/jour/${index}`}
                  className="flex items-center gap-3.5 bg-parchemin-carte border border-parchemin-bordure rounded-2xl px-4 py-3 shadow-[0_4px_12px_rgba(60,40,20,0.10)] active:scale-[0.98] transition-transform">
              <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#5a4a36]/10 border border-parchemin-bordure">
                <CalendarClock className="w-[18px] h-[18px] text-sepia" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-[15px] text-encre font-semibold leading-tight first-letter:uppercase">{formaterDate(index)}</p>
                <p className="text-[11px] text-encre-douce mt-0.5">
                  Mot n°{index + 1}{commence && <span className="text-jeu-minijeux font-semibold"> · commencé</span>}
                </p>
              </div>
              <ChevronRight className="shrink-0 w-5 h-5 text-encre/40" strokeWidth={2} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
