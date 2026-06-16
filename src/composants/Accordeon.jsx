import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import TexteFormate from '../composants/TexteFormate';


function Accordeon({ titre, contenu }) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div className="border-t border-terra-border">
      <button
        onClick={() => setOuvert((v) => !v)}
        className="w-full flex justify-between items-center py-3 text-left"
      >
        <span className="text-sm font-medium text-terra-900">{titre}</span>
        <ChevronDown
          className={`w-4 h-4 text-terra-muted transition-transform ${
            ouvert ? 'rotate-180' : ''
          }`}
          strokeWidth={2}
        />
      </button>

      {ouvert && (
        <div className="pb-3 text-sm text-terra-900 leading-relaxed whitespace-pre-line">
          <TexteFormate texte={contenu} />
        </div>
      )}
    </div>
  );
}

export default Accordeon;