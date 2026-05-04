import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import lieux from '../donnees/lieux.json';
import TexteAvecLiens from '../composants/TexteAvecLiens';

function DetailLieu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lieu = lieux.find((l) => l.id === id);

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

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-terra-500 mb-4"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </button>

      <h1 className="font-serif text-3xl text-terra-900 leading-tight mb-4">
        {lieu.nom}
      </h1>

      <TexteAvecLiens texte={lieu.description} />
    </div>
  );
}

export default DetailLieu;