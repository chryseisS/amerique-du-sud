import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Quiz() {
  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[25px] text-encre font-semibold text-center -mt-6">Quiz</h1>
        <p className="text-center text-[12.5px] text-sepia mt-0.5">Choisis un mode de jeu</p>
      </div>

      {/* Contenu placeholder */}
      <div className="relative px-5 pt-10 pb-6">
        <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
          <div className="font-serif text-lg text-encre font-semibold">À venir</div>
          <p className="text-xs text-encre-douce mt-2 leading-snug">
            Les modes Quiz arriveront bientôt — Exploration, Vrai ou Faux, 2 Vraies 1 Fausse, Chrono, Duel…
          </p>
        </div>
      </div>
    </div>
  );
}