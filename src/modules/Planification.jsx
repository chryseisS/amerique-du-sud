import { useState } from 'react';
import { Search, X } from 'lucide-react';
import activites from '../donnees/activites.json';
import { PAYS, TYPES_ACTIVITES } from '../donnees/constantes';
import CarteActivite from '../composants/CarteActivite';

function Planification() {
  // ─── ÉTATS ──────────────────────────────────────────
  const [paysActif, setPaysActif] = useState('Pérou');
  const [typeActif, setTypeActif] = useState('Tout');
  const [recherche, setRecherche] = useState('');

  // ─── FILTRAGE ───────────────────────────────────────
  const rechercheNorm = recherche.trim().toLowerCase();

  // Si on tape une recherche, on cherche dans TOUS les pays
  // Sinon, on filtre par pays sélectionné
  const parPays = rechercheNorm
    ? activites
    : activites.filter((a) => a.pays === paysActif);

  // Filtre par type (sauf si "Tout")
  const parType =
    typeActif === 'Tout'
      ? parPays
      : parPays.filter((a) => a.type === typeActif);

  // Filtre par texte (nom ou lieu)
  const resultats = rechercheNorm
    ? parType.filter(
        (a) =>
          a.nom.toLowerCase().includes(rechercheNorm) ||
          a.lieu.toLowerCase().includes(rechercheNorm)
      )
    : parType;

  // Tri par importance décroissante (les null/0 atterrissent en bas)
  const resultatsTries = [...resultats].sort(
    (a, b) => (b.importance || 0) - (a.importance || 0)
  );

  // ─── RENDU ──────────────────────────────────────────
  return (
    <div className="p-4">
      <h1 className="text-3xl font-serif text-terra-900 mb-3">Planification</h1>

      {/* Barre de recherche */}
      <div className="flex items-center gap-2 bg-terra-100 border border-terra-border rounded-xl px-3.5 py-2 mb-3">
        <Search className="w-4 h-4 text-terra-muted" strokeWidth={2} />
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher une activité, un lieu…"
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

      {/* Pills pays — masquées pendant la recherche */}
      {!rechercheNorm && (
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {PAYS.map((pays) => {
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
      )}

      {/* Pills type */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {['Tout', ...TYPES_ACTIVITES].map((type) => {
          const actif = type === typeActif;
          return (
            <button
              key={type}
              onClick={() => setTypeActif(type)}
              className={
                actif
                  ? 'px-3 py-1 rounded-full text-xs bg-terra-500 text-white border border-terra-500'
                  : 'px-3 py-1 rounded-full text-xs bg-terra-100 text-terra-muted border border-terra-border'
              }
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Compteur de résultats */}
      <div className="text-xs text-terra-muted mb-2">
        {resultatsTries.length} résultat{resultatsTries.length !== 1 ? 's' : ''}
        {rechercheNorm ? ` pour « ${recherche} »` : ` · ${paysActif}`}
      </div>

      {/* Liste */}
      {resultatsTries.length === 0 ? (
        <div className="text-center py-8 text-terra-muted text-sm">
          Aucun résultat
        </div>
      ) : (
        resultatsTries.map((act) => (
          <CarteActivite key={act.nom} activite={act} />
        ))
      )}
    </div>
  );
}

export default Planification;