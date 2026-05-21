import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Play, ChevronRight } from 'lucide-react';
import activites from '../donnees/activites.json';
import { COULEURS_TYPES_ACTIVITES, versSlug } from '../donnees/constantes';
import Etoiles from '../composants/Etoiles';
import GalerieActivite from '../composants/GalerieActivite';
import TexteFormate from '../composants/TexteFormate';


function DetailActivite() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const activite = activites.find((a) => versSlug(a.nom) === slug);

  if (!activite) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-terra-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Retour</span>
        </button>
        <p className="text-terra-muted">Activité introuvable.</p>
      </div>
    );
  }

  const couleurBadge = COULEURS_TYPES_ACTIVITES[activite.type];

  // Le lieu devient cliquable si lieuId est présent dans le JSON
  const LieuAffiche = () =>
    activite.lieuId ? (
      <Link
        to={`/planification/lieux/${activite.lieuId}`}
        className="text-terra-500 underline-offset-2 hover:underline"
      >
        {activite.lieu}
      </Link>
    ) : (
      <span>{activite.lieu}</span>
    );

  return (
    <div className="p-4">
      {/* Bouton retour intelligent */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-terra-500 mb-4"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </button>

      {/* Badge type + lieu cliquable + pays */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md"
          style={{ backgroundColor: couleurBadge }}
        >
          {activite.type}
        </span>
        <span className="text-xs text-terra-muted flex items-center gap-1">
          <MapPin className="w-3 h-3" strokeWidth={2} />
          <LieuAffiche /> · {activite.pays}
        </span>
      </div>

      {/* Titre */}
      <h1 className="font-serif text-2xl text-terra-900 leading-tight mb-2">
        {activite.nom}
      </h1>

      {/* Étoiles + durée */}
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

      <div className="h-px bg-terra-border mb-4" />

      {/* Galerie d'images (n'affiche rien si pas d'images) */}
      <GalerieActivite images={activite.images} />

      {/* Description en paragraphes */}
      {activite.description.split('\n\n').map((paragraphe, i) => (
        <p
          key={i}
          className="text-sm text-terra-900 leading-relaxed mb-3 text-justify"
        >
          <TexteFormate texte={paragraphe} />
        </p>
      ))}

      {/* Bouton visite guidée */}
      {activite.visiteGuidee && (
        <Link
          to={`/apprendre/visites-guidees/${versSlug(activite.nom)}`}
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