import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import pays from '../donnees/pays.json';
import { COULEURS_PAYS } from '../donnees/constantes'; // Optionnel : si tu veux caler la vraie couleur du pays
import TexteAvecLiens from '../composants/TexteAvecLiens';

function DetailPays() {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = pays.find((x) => x.id === id);

  // Récupération des couleurs si disponibles, sinon fallback sur le thème Terra
  const couleurs = COULEURS_PAYS?.[p?.nom] || { accent: 'var(--color-terra-900, #7c2d12)' };

  if (!p) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-terra-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Retour</span>
        </button>
        <p className="text-terra-muted">Pays introuvable.</p>
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
            {/* Flèche de retour stylisée */}
            <ArrowLeft 
              className="w-6 h-6 flex-shrink-0 text-terra-500" 
              strokeWidth={2.5} 
            />
            
            <h1 
              className="font-serif text-3xl font-semibold text-terra-900 leading-tight tracking-wide"
              style={{ color: couleurs.accent }}
            >
              {p.nom}
            </h1>
          </div>
          
          {/* Petite ligne d'accentuation calée sous le début du texte */}
          <div 
            className="h-[2px] w-8 mt-3.5 ml-9 rounded-full" 
            style={{ backgroundColor: couleurs.accent }}
          />
        </div>
      </div>

      {/* ─── CONTENU DU GUIDE ─── */}
      <div className="prose prose-terra max-w-none">
        <TexteAvecLiens texte={p.description} />
      </div>
    </div>
  );
}

export default DetailPays;