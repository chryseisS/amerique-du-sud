import { Link } from 'react-router-dom';
import { MapPin, Flame } from 'lucide-react';
import { COULEURS_TYPES_ACTIVITES, versSlug, estIncontournable } from '../donnees/constantes';

function CarteActivite({ activite }) {
  const couleurBadge = COULEURS_TYPES_ACTIVITES[activite.type];
  const lieuAffiche = activite.sousZone || activite.lieu;
  const important = estIncontournable(activite);

  return (
    <Link
      to={`/planification/activites/${versSlug(activite.nom)}`}
      className={`
        relative mb-2 flex gap-3 rounded-xl border px-3.5 py-3 transition
        active:scale-[0.99]
        hover:border-terra-500/40

        ${important
          ? 'bg-orange-100 border-orange-300'
          : 'bg-terra-100 border-terra-border hover:bg-terra-50'
        }
      `}
    >

      {/* FLAMME CENTRÉE SUR LA CARTE */}
      {important && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Flame className="w-4 h-4 text-orange-600" />
        </div>
      )}

      {/* CONTENT */}
      <div className="flex-1 min-w-0">

        {/* TOP */}
        <div className="flex items-start gap-2 flex-wrap">

          <span
            className="text-white text-[10px] font-medium px-2 py-0.5 rounded-md"
            style={{ backgroundColor: couleurBadge }}
          >
            {activite.type}
          </span>

          <span className="text-[11px] text-terra-muted flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {lieuAffiche}

            {activite.duree && (
              <>
                <span className="mx-0.5">·</span>
                <span className="italic">{activite.duree}</span>
              </>
            )}
          </span>

        </div>

        {/* TITLE */}
        <div className="font-serif font-semibold text-base text-terra-900 leading-tight mt-1">
          {activite.nom}
        </div>

      </div>
    </Link>
  );
}

export default CarteActivite;