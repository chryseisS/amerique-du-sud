import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Play, ChevronRight } from 'lucide-react';
import lieux from '../donnees/lieux.json';
import visites from '../donnees/visitesGuidees.json';
import { COULEURS_PAYS } from '../donnees/constantes';
import TexteAvecLiens from '../composants/TexteAvecLiens';

function DetailLieu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lieu = lieux.find((l) => l.id === id);

  // Couleur du pays associé au lieu si elle existe
  const couleurs = COULEURS_PAYS?.[lieu?.pays] || { accent: 'var(--color-terra-900, #7c2d12)' };

  if (!lieu) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-terra-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Retour</span>
        </button>
        <p className="text-terra-muted">Lieu introuvable.</p>
      </div>
    );
  }

  // Une visite guidée existe pour ce lieu si un id "lieu-<id>" est présent dans le JSON
  const idVisite = `lieu-${lieu.id}`;
  const aUneVisite = visites.some((v) => v.id === idVisite);

  return (
    <div className="p-4">
      {/* ─── TITRE AVEC FLÈCHE RETOUR INTÉGRÉE ─── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div
            className="flex items-center gap-3 active:opacity-70 transition cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft
              className="w-6 h-6 flex-shrink-0"
              strokeWidth={2.5}
              style={{ color: couleurs.accent }}
            />
            <h1
              className="font-serif text-3xl font-semibold text-terra-900 leading-tight tracking-wide"
              style={{ color: couleurs.accent }}
            >
              {lieu.nom}
            </h1>
          </div>

          <div
            className="h-[2px] w-8 mt-3.5 ml-9 rounded-full"
            style={{ backgroundColor: couleurs.accent }}
          />
        </div>
      </div>

      {/* ─── CONTENU DE LA DESCRIPTION ─── */}
      <div className="prose prose-terra max-w-none">
        <TexteAvecLiens texte={lieu.description} />
      </div>

      {/* ─── BOUTON VISITE GUIDÉE ─── */}
      {aUneVisite && (
        <Link
          to={`/apprendre/visites-guidees/${idVisite}`}
          className="flex items-center gap-3 bg-terra-100 border border-terra-500 rounded-xl px-3.5 py-3 mt-6"
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

export default DetailLieu;