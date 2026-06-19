import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import lieux from '../donnees/lieux.json';
import { COULEURS_PAYS } from '../donnees/constantes';
import TexteAvecLiens from '../composants/TexteAvecLiens';

function DetailLieu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lieu = lieux.find((l) => l.id === id);

  // Récupération de la couleur du pays associé au lieu si elle existe
  const couleurs = COULEURS_PAYS?.[lieu?.pays] || { accent: 'var(--color-terra-900, #7c2d12)' };

  if (!lieu) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-terra-00 mb-4"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} style={{ color: couleurs.accent }}/>
          <span className="text-sm">Retour</span>
        </button>
        <p className="text-terra-muted">Lieu introuvable.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* ─── TITRE AVEC FLÈCHE RETOUR INTÉGRÉE ─── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div 
            className="flex items-center gap-3 active:opacity-70 transition cursor-pointer" 
            onClick={() => navigate(-1)}
          >
            {/* Flèche de retour alignée */}
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
          
          {/* Ligne décorative calée sous le début du texte */}
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
    </div>
  );
}

export default DetailLieu;