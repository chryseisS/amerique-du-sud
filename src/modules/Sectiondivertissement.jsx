import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Film, Music, Mic, ExternalLink } from 'lucide-react';
import divertissement from '../donnees/divertissement.json';
import { cheminImage } from '../utils/cheminImage';


/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « SECTION DIVERTISSEMENT »  — route /jeux/divertissement/:categorieId
   ──────────────────────────────────────────────────────────────────
   • Accessible directement depuis les cartes Films/Playlists/Podcasts
     du hub principal (plus de page intermédiaire "Divertissement").
   • Un seul composant générique pour les 3 catégories : le rendu de
     chaque carte est identique, seul le contenu de
     ../donnees/divertissement.json change.
   • Élément attendu : { id, titre, description?, image?, lien }
   ════════════════════════════════════════════════════════════════════ */

const CONFIG = {
  films:     { titre: 'Films',     Icone: Film,  cle: 'films' },
  playlists: { titre: 'Playlists', Icone: Music, cle: 'playlists' },
  podcasts:  { titre: 'Podcasts',  Icone: Mic,   cle: 'podcasts' },
};

function Vignette({ image }) {
  if (!image) return null;
  return (
    <div
      className="relative w-16 shrink-0 rounded-xl overflow-hidden border border-[rgba(60,40,20,0.35)] bg-[#5a4a36]"
      style={{ backgroundImage: `url('${cheminImage(image)}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
  );
}

export default function SectionDivertissement() {
  const { categorieId } = useParams();
  const config = CONFIG[categorieId];

  if (!config) return <Navigate to="/jeux" replace />;

  const items = divertissement[config.cle] ?? [];
  const { Icone } = config;

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[24px] text-encre font-semibold text-center -mt-6">{config.titre}</h1>
      </div>

      {/* Liste / état vide */}
      <div className="relative px-[18px] pt-4 pb-6 flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)] flex flex-col items-center gap-2.5">
            <Icone className="w-6 h-6 text-sepia" strokeWidth={1.8} />
            <p className="text-[13px] text-encre-douce leading-snug">
              Rien ici pour l'instant — cette section sera complétée bientôt.
            </p>
          </div>
        ) : (
          items.map((it) => (
            <a key={it.id} href={it.lien} target="_blank" rel="noreferrer"
               className="flex gap-3.5 items-stretch bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-3 shadow-[0_4px_12px_rgba(60,40,20,0.12)] transition-transform duration-200 hover:-translate-y-0.5">
              <Vignette image={it.image} />
              <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                <h3 className="font-serif text-[15px] leading-tight text-encre font-semibold m-0">{it.titre}</h3>
                {it.description && (
                  <p className="text-[11.5px] text-encre-douce mt-1 leading-snug">{it.description}</p>
                )}
              </div>
              <ExternalLink className="self-center shrink-0 w-4 h-4 text-encre/40" strokeWidth={2} />
            </a>
          ))
        )}
      </div>
    </div>
  );
}