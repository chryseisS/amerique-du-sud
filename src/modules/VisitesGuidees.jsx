import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import visites from '../donnees/visitesGuidees.json';
import { PAYS } from '../donnees/constantes';

function VisitesGuidees() {
  const [paysActif, setPaysActif] = useState('Tous');
  const [recherche, setRecherche] = useState('');
  const rechercheNorm = recherche.trim().toLowerCase();

  // Filtre pays : pays est une chaîne ici, pas un tableau
  const parPays =
    paysActif === 'Tous'
      ? visites
      : visites.filter((v) => v.pays === paysActif);

  const resultats = rechercheNorm
    ? parPays.filter((v) => v.titre.toLowerCase().includes(rechercheNorm))
    : parPays;

  return (
    <div className="p-4">
      {/* Bouton retour */}
      <Link to="/apprendre" className="flex items-center gap-2 text-terra-500 mb-3">
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </Link>

      {/* En-tête */}
      <h1 className="text-3xl font-serif text-terra-900 leading-tight mb-1">
        Visites guidées
      </h1>
      <div className="text-[10px] uppercase tracking-wider text-terra-muted mb-4">
        lieux et sites à connaître
      </div>

      {/* Recherche */}
      <div className="flex items-center gap-2 bg-terra-100 border border-terra-border rounded-xl px-3.5 py-2 mb-3">
        <Search className="w-4 h-4 text-terra-muted" strokeWidth={2} />
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher une visite…"
          className="flex-1 bg-transparent outline-none text-sm text-terra-900 placeholder:text-terra-muted min-w-0"
        />
        {recherche && (
          <button onClick={() => setRecherche('')} className="text-terra-muted hover:text-terra-500 flex-shrink-0">
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Filtres pays — toujours visibles, comme PremieresFois */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {['Tous', ...PAYS].map((pays) => {
          const actif = pays === paysActif;
          return (
            <button
              key={pays}
              onClick={() => setPaysActif(pays)}
              className={
                actif
                  ? 'px-3 py-1 rounded-full text-xs bg-terra-500 text-white border border-terra-500'
                  : 'px-3 py-1 rounded-full text-xs bg-terra-100 text-terra-muted border border-terra-border'
              }
            >
              {pays}
            </button>
          );
        })}
      </div>

      {/* Compteur */}
      <div className="text-xs text-terra-muted mb-3">
        {resultats.length} visite{resultats.length !== 1 ? 's' : ''}
        {rechercheNorm && ` pour « ${recherche} »`}
      </div>

      {/* Liste */}
      {resultats.length === 0 ? (
        <div className="text-center py-8 text-terra-muted text-sm">
          Aucune visite ne correspond
        </div>
      ) : (
        resultats.map((v) => (
          <Link
            key={v.id}
            to={`/apprendre/visites-guidees/${v.id}`}
            className="block bg-terra-100 border border-terra-border rounded-xl px-3.5 py-3 mb-2 hover:border-terra-500/40 transition-colors"
          >
            <div className="font-serif text-base text-terra-900 leading-tight">
              {v.titre}
            </div>
            <div className="text-[11px] text-terra-muted mt-0.5">{v.pays}</div>
          </Link>
        ))
      )}
    </div>
  );
}

export default VisitesGuidees;