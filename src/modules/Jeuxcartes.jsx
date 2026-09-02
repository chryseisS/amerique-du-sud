import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Spade } from 'lucide-react';
import CARTES_JEUX from '../donnees/cartes.json';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « JEUX DE CARTES »  — route /jeux/mini-jeux/cartes
   ──────────────────────────────────────────────────────────────────
   • Données dans ../donnees/cartes.json. Schéma d'un jeu :
       { id, titre, origine?, joueurs?, materiel?, objectif,
         sections: [{ titre, contenu }, ...], note? }
   ════════════════════════════════════════════════════════════════════ */

export default function JeuxCartes() {
  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux/mini-jeux" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[22px] text-encre font-semibold text-center -mt-6">Jeux de cartes</h1>
        <p className="text-center text-[12.5px] text-sepia mt-0.5">Les règles, pour ne rien oublier</p>
      </div>

      {/* Liste */}
      <div className="relative px-[18px] pt-4 pb-6 flex flex-col gap-3">
        {CARTES_JEUX.map((jeu) => (
          <Link key={jeu.id} to={`/jeux/mini-jeux/cartes/${jeu.id}`}
                className="flex items-center gap-3.5 bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-4 shadow-[0_4px_12px_rgba(60,40,20,0.12)] transition-transform duration-200 hover:-translate-y-0.5">
            <div className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-[#5a4a36]/10 border border-parchemin-bordure">
              <Spade className="w-5 h-5 text-sepia" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-[16px] leading-tight text-encre font-semibold m-0">{jeu.titre}</h3>
              {jeu.origine && <p className="text-[11.5px] text-encre-douce mt-1">{jeu.origine}</p>}
            </div>
            <ChevronRight className="self-center shrink-0 w-5 h-5 text-encre/40" strokeWidth={2} />
          </Link>
        ))}
      </div>
    </div>
  );
}