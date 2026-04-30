import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { COULEURS_TYPES_ACTIVITES, versSlug } from '../donnees/constantes';
import Etoiles from './Etoiles';

function CarteActivite({ activite }) {
  const couleurBadge = COULEURS_TYPES_ACTIVITES[activite.type];

  return (
    <Link
      to={`/planification/${versSlug(activite.nom)}`}
      className="bg-terra-100 border border-terra-border rounded-xl px-3.5 py-3 mb-2 flex items-center gap-3 hover:border-terra-500/40 transition-colors"
    >
      <div className="flex-1 min-w-0">
        {/* Ligne 1 : badge + lieu + durée */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className="text-white text-[10px] font-medium px-2 py-0.5 rounded-md"
            style={{ backgroundColor: couleurBadge }}
          >
            {activite.type}
          </span>
          <span className="text-[11px] text-terra-muted flex items-center gap-1">
            <MapPin className="w-3 h-3" strokeWidth={2} />
            {activite.lieu}
            {activite.duree && (
              <>
                <span className="mx-0.5">·</span>
                <span className="italic">{activite.duree}</span>
              </>
            )}
          </span>
        </div>

        {/* Ligne 2 : nom de l'activité */}
        <div className="font-serif text-base text-terra-900 leading-tight">
          {activite.nom}
        </div>
      </div>

      {/* À droite : étoiles (rien si pas d'importance) */}
      <Etoiles nombre={activite.importance} />
    </Link>
  );
}

export default CarteActivite;