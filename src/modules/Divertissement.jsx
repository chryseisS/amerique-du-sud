import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Film, Music, Mic } from 'lucide-react';
import divertissement from '../donnees/divertissement.json';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « DIVERTISSEMENT »
   ──────────────────────────────────────────────────────────────────
   • Les données sont dans ../donnees/divertissement.json, schéma :
     { "films": [...], "playlists": [...], "podcasts": [...] }
     Chaque élément d'une des 3 listes : { id, titre, description?,
     image?, lien }  (lien = URL externe : bande-annonce/streaming,
     playlist Spotify/YouTube, page ou appli du podcast).
   • Tant qu'une liste est vide, l'écran de section affiche un état
     "à venir" — rien à faire de spécial pour l'instant.
   ════════════════════════════════════════════════════════════════════ */

const SECTIONS = [
  { id: 'films',     titre: 'Films',     sousTitre: 'À voir avant ou pendant le voyage', Icone: Film,  cle: 'films' },
  { id: 'playlists', titre: 'Playlists', sousTitre: "Musiques d'Amérique du Sud",         Icone: Music, cle: 'playlists' },
  { id: 'podcasts',  titre: 'Podcasts',  sousTitre: 'Pour la route',                      Icone: Mic,   cle: 'podcasts' },
];

export default function Divertissement() {
  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[24px] text-encre font-semibold text-center -mt-6">Divertissement</h1>
        <p className="text-center text-[12.5px] text-sepia mt-0.5">Pour prolonger le voyage</p>
      </div>

      {/* Liste des sections */}
      <div className="relative px-[18px] pt-4 pb-6 flex flex-col gap-3">
        {SECTIONS.map(({ id, titre, sousTitre, Icone, cle }) => {
          const n = divertissement[cle]?.length ?? 0;
          return (
            <Link key={id} to={`/jeux/divertissement/${id}`}
                  className="flex gap-3.5 items-center bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-4 shadow-[0_4px_12px_rgba(60,40,20,0.12)] transition-transform duration-200 hover:-translate-y-0.5">
              <div className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-[#5a4a36]/10 border border-parchemin-bordure">
                <Icone className="w-5 h-5 text-sepia" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-[16px] leading-tight text-encre font-semibold m-0">{titre}</h3>
                <p className="text-[11.5px] text-encre-douce mt-1 leading-snug">{sousTitre}</p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-sepia shrink-0">
                {n > 0 ? n : 'bientôt'}
              </span>
              <ChevronRight className="self-center shrink-0 w-5 h-5 text-encre/40" strokeWidth={2} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}