import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Music } from 'lucide-react';
import { DRAPEAUX, paysDuSlug } from '../donnees/constantes';
import PLAYLISTS from '../donnees/playlists.json';
import { cheminImage } from '../utils/cheminImage';


export default function DetailPlaylist() {
  const { paysSlug } = useParams();
  const pays = paysDuSlug(paysSlug);
  const data = pays ? PLAYLISTS[pays] : null;

  if (!pays || !data) return <Navigate to="/jeux/medias/playlists" replace />;

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-2">
        <Link to="/jeux/medias/playlists" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
      </div>

      <div className="relative px-5 pb-8 flex flex-col gap-4">
        {/* Titre + drapeau */}
        <div className="flex flex-col items-center gap-2 text-center mb-1">
          {DRAPEAUX[pays] && (
            <img src={cheminImage(DRAPEAUX[pays])} alt="" className="w-11 h-11 rounded-full object-cover border border-parchemin-bordure" />
          )}
          <h1 className="font-serif text-[24px] text-encre font-semibold leading-tight">{pays}</h1>
        </div>

        {/* Bouton vers la playlist */}
        {data.lien ? (
          <a href={data.lien} target="_blank" rel="noreferrer"
             className="inline-flex items-center justify-center gap-2 bg-vert-cta text-creme font-semibold text-[13.5px] rounded-full px-5 py-3">
            <Music className="w-4 h-4" strokeWidth={2} />Ouvrir dans Apple Music
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
          </a>
        ) : (
          <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-4 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
            <p className="text-[12.5px] text-encre-douce leading-snug">Playlist pas encore ajoutée.</p>
          </div>
        )}

        {/* Artistes */}
        {data.artistes.length === 0 ? (
          <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
            <p className="text-[13px] text-encre-douce leading-snug">Aucun artiste renseigné pour l'instant.</p>
          </div>
        ) : (
          data.artistes.map((a) => (
            <div key={a.nom}
                 className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-serif text-[16px] text-encre font-semibold m-0">{a.nom}</h3>
                {a.genre && (
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-sepia bg-[#5a4a36]/10 rounded-full px-2 py-0.5">
                    {a.genre}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-justify text-encre-douce leading-relaxed">{a.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}