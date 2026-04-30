import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Play, ChevronRight } from 'lucide-react';
import activites from '../donnees/activites.json';
import { COULEURS_TYPES_ACTIVITES, versSlug } from '../donnees/constantes';
import Etoiles from '../composants/Etoiles';

function DetailActivite() {
  const { slug } = useParams();

  // On cherche l'activité dont le slug du nom correspond à l'URL
  const activite = activites.find((a) => versSlug(a.nom) === slug);

  // Cas où l'activité n'existe pas (URL bidouillée par exemple)
  if (!activite) {
    return (
      <div className="p-4">
        <Link to="/planification" className="flex items-center gap-2 text-terra-500 mb-4">
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Retour</span>
        </Link>
        <p className="text-terra-muted">Activité introuvable.</p>
      </div>
    );
  }

  const couleurBadge = COULEURS_TYPES_ACTIVITES[activite.type];

  return (
    <div className="p-4">
      {/* Bouton retour */}
      <Link
        to="/planification"
        className="flex items-center gap-2 text-terra-500 mb-4"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </Link>

      {/* Badge type + lieu/pays */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md"
          style={{ backgroundColor: couleurBadge }}
        >
          {activite.type}
        </span>
        <span className="text-xs text-terra-muted flex items-center gap-1">
          <MapPin className="w-3 h-3" strokeWidth={2} />
          {activite.lieu} · {activite.pays}
        </span>
      </div>

      {/* Titre */}
      <h1 className="font-serif text-2xl text-terra-900 leading-tight mb-2">
        {activite.nom}
      </h1>

      {/* Étoiles + durée (chacun s'affiche seulement si renseigné) */}
      {(activite.importance || activite.duree) && (
        <div className="flex items-center gap-3 mb-4">
          <Etoiles nombre={activite.importance} />
          {activite.duree && (
            <span className="text-sm text-terra-muted italic">
              {activite.duree}
            </span>
          )}
        </div>
      )}

      {/* Séparateur */}
      <div className="h-px bg-terra-border mb-4" />

      {/* Description en paragraphes */}
      {activite.description.split('\n\n').map((paragraphe, i) => (
        <p
          key={i}
          className="text-sm text-terra-900 leading-relaxed mb-3 text-justify"
        >
          {paragraphe}
        </p>
      ))}

      {/* Bouton visite guidée — visible seulement si visiteGuidee est true */}
      {activite.visiteGuidee && (
        <Link
          to={`/visite-guidee/${versSlug(activite.nom)}`}
          className="flex items-center gap-3 bg-terra-100 border border-terra-500 rounded-xl px-3.5 py-3 mt-4"
        >
          <div className="w-8 h-8 rounded-full bg-terra-500/15 flex items-center justify-center flex-shrink-0">
            <Play className="w-4 h-4 text-terra-500" strokeWidth={2} fill="currentColor" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-terra-900 font-medium">
              Visite guidée disponible
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-terra-500" strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}

export default DetailActivite;