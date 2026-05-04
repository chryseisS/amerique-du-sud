import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

function CartePremiereFois({ premiere, fait, onToggle }) {
  const [ouvert, setOuvert] = useState(false);
  const aDescription = Boolean(premiere.description);

  return (
    <div className="bg-terra-100 border border-terra-border rounded-xl mb-2 overflow-hidden">
      {/* ─── Ligne principale (toujours visible) ─── */}
      <button
        onClick={() => setOuvert((v) => !v)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left"
      >
        {/* Pastille rouge / verte */}
        <div
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            fait ? 'bg-emerald-500' : 'bg-red-400'
          }`}
        />

        {/* Bloc texte */}
        <div className="flex-1 min-w-0">
          <div className="font-serif text-m text-terra-900 leading-tight">
            {premiere.nom}
          </div>
        </div>

        {/* Chevron qui pivote — toujours visible */}
        <ChevronDown
          className={`w-4 h-4 text-terra-muted transition-transform ${
            ouvert ? 'rotate-180' : ''
          }`}
          strokeWidth={2}
        />
      </button>

      {/* ─── Déroulé (visible si ouvert) ─── */}
      {ouvert && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-terra-border/50">
          {/* Description si présente */}
          {aDescription && (
            <p className="text-sm text-terra-900 leading-relaxed mb-3">
              {premiere.description}
            </p>
          )}

          {/* Bouton Fait / Marquer comme fait — toujours présent */}
          <button
            onClick={onToggle}
            className={`w-full rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 ${
              fait
                ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                : 'bg-terra-500 text-white'
            }`}
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
            {fait ? 'Fait' : 'Marquer comme fait'}
          </button>
        </div>
      )}
    </div>
  );
}

export default CartePremiereFois;
