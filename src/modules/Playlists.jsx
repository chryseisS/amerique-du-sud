import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Music } from 'lucide-react';
import { PAYS, DRAPEAUX, COULEURS_PAYS, versSlug } from '../donnees/constantes';
import PLAYLISTS from '../donnees/playlists.json';
import { cheminImage } from '../utils/cheminImage';


/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « PLAYLISTS »  — route /jeux/medias/playlists
   ──────────────────────────────────────────────────────────────────
   • Données dans ../donnees/playlists.json, un objet clé = nom de pays
     (mêmes noms que PAYS dans constantes.js) :
       { "<Pays>": { lien: string|null, artistes: [{ nom, genre, description }, ...] } }
     `lien` = URL Apple Music de la playlist du pays (null tant que non
     encore créée/renseignée).
   ════════════════════════════════════════════════════════════════════ */

export default function Playlists() {
  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux/medias" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[22px] text-encre font-semibold text-center -mt-6">Playlists</h1>
        <p className="text-center text-[12.5px] text-sepia mt-0.5">Les incontournables, pays par pays</p>
      </div>

      {/* Liste des pays */}
      <div className="relative px-[18px] pt-4 pb-6 flex flex-col gap-3">
        {PAYS.map((pays) => {
          const c = COULEURS_PAYS[pays];
          const data = PLAYLISTS[pays];
          const nb = data?.artistes?.length ?? 0;
          return (
            <Link key={pays} to={`/jeux/medias/playlists/${versSlug(pays)}`}
                  className="flex items-center gap-3.5 bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-4 shadow-[0_4px_12px_rgba(60,40,20,0.12)] transition-transform duration-200 hover:-translate-y-0.5">
              <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden border border-parchemin-bordure bg-white flex items-center justify-center">
                {DRAPEAUX[pays]
                  ? <img src={cheminImage(DRAPEAUX[pays])} alt="" className="w-full h-full object-cover" />
                  : <Music className="w-5 h-5 text-sepia" strokeWidth={1.8} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-[16px] leading-tight text-encre font-semibold m-0">{pays}</h3>
                <p className="text-[11.5px] text-encre-douce mt-1">
                  {nb > 0 ? `${nb} groupe${nb > 1 ? 's' : ''} présenté${nb > 1 ? 's' : ''}` : 'Bientôt disponible'}
                </p>
              </div>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c?.accent }} />
              <ChevronRight className="self-center shrink-0 w-5 h-5 text-encre/40" strokeWidth={2} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}