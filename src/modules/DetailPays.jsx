import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import pays from '../donnees/pays.json';
import TexteAvecLiens from '../composants/TexteAvecLiens';

function DetailPays() {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = pays.find((x) => x.id === id);

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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-terra-500 mb-4"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </button>

      <h1 className="font-serif text-3xl text-terra-900 leading-tight mb-4">
        {p.nom}
      </h1>

      <TexteAvecLiens texte={p.description} />
    </div>
  );
}

export default DetailPays;