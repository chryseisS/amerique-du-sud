import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import visites from '../donnees/visitesGuidees.json';
import Accordeon from '../composants/Accordeon';
import TexteAvecLiens from '../composants/TexteAvecLiens';

function DetailVisiteGuidee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const v = visites.find((x) => x.id === id);

  if (!v) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-terra-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Retour</span>
        </button>
        <p className="text-terra-muted">Visite introuvable.</p>
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

      <h1 className="font-serif text-3xl text-terra-900 leading-tight mb-1">
        {v.titre}
      </h1>
      <div className="text-[11px] uppercase tracking-wider text-terra-muted mb-4">
        {v.pays}
      </div>

      {/* Description courte */}
      <div className="mb-4 text-sm text-terra-900 leading-relaxed">
        <TexteAvecLiens texte={v.description} />
      </div>

      {/* Accordéons sections */}
      {v.sections && v.sections.length > 0 && (
        <div className="border-b border-terra-border">
          {v.sections.map((section, i) => (
            <Accordeon
              key={i}
              titre={section.titre}
              contenu={section.contenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DetailVisiteGuidee;