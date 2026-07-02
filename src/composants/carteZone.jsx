import { Link } from 'react-router-dom';
import { Flame, Hourglass, ChevronRight, MapPin } from 'lucide-react';
import { COULEURS_PAYS, versSlug, ICONES_ZONES } from '../donnees/constantes';

function CarteZone({ zone }) {
  const couleurs = COULEURS_PAYS[zone.pays] || COULEURS_PAYS['Pérou'];
  const iconeUrl = ICONES_ZONES?.[zone.lieuId];

  return (
    <Link
      to={`/planification/zones/${versSlug(zone.pays)}/${zone.slug}`}
      className="bg-terra-100 border border-terra-border rounded-xl px-3.5 py-2 mb-2 flex items-center gap-3.5 hover:bg-terra-50 hover:border-terra-500/40 active:scale-[0.99] transition"
    >
      {/* ICÔNE RONDE */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ backgroundColor: couleurs.iconBg, color: couleurs.iconText }}
      >
        {iconeUrl ? (
          <img
            src={iconeUrl}
            alt=""
            className="w-16 h-16"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <MapPin className="w-5 h-5" strokeWidth={2} />
        )}
      </div>

      {/* CONTENU */}
      <div className="flex-1 min-w-0">
        {/* Nom de la zone */}
        <div className="font-serif font-semibold text-base text-terra-900 leading-tight">
          {zone.nom}
        </div>

        {/* Nombre d'activités */}
        <div className="text-xs text-terra-muted mt-1">
          {zone.nbActivites} activité{zone.nbActivites !== 1 ? 's' : ''}
        </div>

        {/* Nombre d'incontournables avec flamme */}
        {zone.nbIncontournables > 0 && (
          <div className="text-xs text-orange-600 mt-0.5 flex items-center gap-1">
            <Flame className="w-3 h-3" strokeWidth={2} />
            {zone.nbIncontournables} incontournable{zone.nbIncontournables !== 1 ? 's' : ''}
          </div>
        )}

        {/* Optionnel "si le temps" */}
        {zone.optionnel && (
          <div className="text-xs text-terra-muted mt-0.5 flex items-center gap-1">
            <Hourglass className="w-3 h-3" strokeWidth={2} />
            si le temps
          </div>
        )}
      </div>

      <ChevronRight className="w-5 h-5 text-terra-muted flex-shrink-0" strokeWidth={2} />
    </Link>
  );
}

export default CarteZone;