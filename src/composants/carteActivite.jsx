import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react'; // Ou 'Flame' selon tes préférences
import { COULEURS_TYPES_ACTIVITES, ICONES_TYPES_ACTIVITES, versSlug, estIncontournable } from '../donnees/constantes';

function CarteActivite({ activite }) {
  const couleur = COULEURS_TYPES_ACTIVITES[activite.type] || '#8a7560';
  const icone = ICONES_TYPES_ACTIVITES[activite.type] || null;
  const important = estIncontournable(activite);

  return (
    <Link
      to={`/planification/activites/${versSlug(activite.nom)}`}
      className={`
        group relative mb-3 flex items-stretch overflow-hidden rounded-xl border transition
        active:scale-[0.99] hover:shadow-md
        ${important 
          ? 'border-amber-200/70 bg-gradient-to-br from-amber-50/40 to-terra-100/70 hover:bg-amber-50/60' 
          : 'border-terra-border bg-terra-100 hover:bg-terra-50 hover:border-terra-500/30'
        }
      `}
    >
      {/* BARRE D'ACCENT — couleur du type */}
      <span
        className="w-1.5 flex-shrink-0"
        style={{ backgroundColor: couleur }}
      />

      {/* ICÔNE DU TYPE */}
      {icone && (
        <div className="flex-shrink-0 flex items-center pl-3">
          <img
            src={icone}
            alt=""
            aria-hidden="true"
            className="h-12 w-12 object-contain"
          />
        </div>
      )}

      {/* CONTENU */}
      <div className="flex-1 min-w-0 py-3.5 px-4 flex flex-col justify-between">
        
        {/* LIGNE DU HAUT — Badges & Info */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Gauche : Type + Durée */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm"
              style={{ backgroundColor: couleur }}
            >
              {activite.type}
            </span>

            {activite.duree && (
              <span className="text-[11px] italic text-terra-muted/90 font-serif">
                {activite.duree}
              </span>
            )}

            {activite.sousZone && (
              <span className="text-[11px] italic text-terra-muted/90 font-serif">
                {activite.duree ? `• ${activite.sousZone}` : activite.sousZone}
              </span>
            )}
          </div>

          {/* Droite : Badge Incontournable Premium */}
          {important && (
            <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200/50">
              <Sparkles className="w-3 h-3 text-amber-600 dynamic-pulse" strokeWidth={2.5} />
              Incontournable
            </span>
          )}
        </div>

        {/* TITRE */}
        <h4 className="font-serif text-base text-terra-900 font-medium leading-snug group-hover:text-terra-950 transition-colors">
          {activite.nom}
        </h4>
        
      </div>
    </Link>
  );
}

export default CarteActivite;