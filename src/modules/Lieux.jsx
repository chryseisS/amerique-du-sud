import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import lieux from '../donnees/lieux.json';

function Lieux() {
  const [recherche, setRecherche] = useState('');
  const rechercheNorm = recherche.trim().toLowerCase();

  const resultats = rechercheNorm
    ? lieux.filter((l) => l.nom.toLowerCase().includes(rechercheNorm))
    : lieux;

  return (
    <div className="p-4">

      {/* Recherche */}
      <div className="flex items-center gap-2 bg-terra-100 border border-terra-border rounded-xl px-3.5 py-2 mb-3">
        <Search className="w-4 h-4 text-terra-muted" strokeWidth={2} />
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un lieu…"
          className="flex-1 bg-transparent outline-none text-sm text-terra-900 placeholder:text-terra-muted"
        />
        {recherche && (
          <button
            onClick={() => setRecherche('')}
            className="text-terra-muted hover:text-terra-500"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
      </div>

      <div className="text-xs text-terra-muted mb-2">
        {resultats.length} lieu{resultats.length !== 1 ? 'x' : ''}
        {rechercheNorm && ` pour « ${recherche} »`}
      </div>

      {resultats.length === 0 ? (
        <div className="text-center py-8 text-terra-muted text-sm">
          Aucun lieu
        </div>
      ) : (
        resultats.map((lieu) => (
          <Link
            key={lieu.id}
            to={`/planification/lieux/${lieu.id}`}
            className="bg-terra-100 border border-terra-border rounded-xl px-3.5 py-3 mb-2 flex items-center hover:border-terra-500/40 transition-colors"
          >
            <div className="font-serif text-base text-terra-900 leading-tight">
              {lieu.nom}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default Lieux;