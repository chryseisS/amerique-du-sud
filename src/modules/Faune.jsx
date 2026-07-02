import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import faune from '../donnees/faune.json';
import CarteFaune from '../composants/CarteFaune';
import { useObservationsFaune } from '../hooks/useObservationsFaune';

function Faune() {
  // ─── ÉTATS ──────────────────────────────────────────
  const [statutActif, setStatutActif] = useState('Tous');
  const [recherche, setRecherche] = useState('');

  // Live depuis IndexedDB — se met à jour automatiquement
  const { vuSet } = useObservationsFaune();

  // Helper : un animal est-il vu ?
  const estVu = (animal) => vuSet.has(animal.nom);

  // ─── FILTRAGE ───────────────────────────────────────
  const rechercheNorm = recherche.trim().toLowerCase();

  const parStatut = faune.filter((a) => {
    if (statutActif === 'Tous') return true;
    if (statutActif === 'Vus') return estVu(a);
    if (statutActif === 'AVoir') return !estVu(a);
    if (statutActif === 'Rares') return a.rarete === 3;
    return true;
  });

  const resultats = rechercheNorm
    ? parStatut.filter((a) => a.nom.toLowerCase().includes(rechercheNorm))
    : parStatut;

  const resultatsTries = [...resultats].sort((a, b) => a.numero - b.numero);

  // ─── COMPTEURS ──────────────────────────────────────
  const totalVus = faune.filter(estVu).length;
  const totalAnimaux = faune.length;
  const pctVus = totalAnimaux > 0 ? (totalVus / totalAnimaux) * 100 : 0;

  // ─── RENDU ──────────────────────────────────────────
  return (
    <div className="p-4">
      {/* Bouton retour */}
      <Link
        to="/journal"
        className="flex items-center gap-2 text-terra-500 mb-3"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </Link>

      {/* En-tête : titre + compteur global */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-3xl font-serif text-terra-900 leading-tight">
            Pokédex
          </h1>
          <div className="text-[10px] uppercase tracking-wider text-terra-muted mt-0.5">
            de la faune
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium text-terra-500">
            {totalVus}
            <span className="text-terra-muted font-normal"> / {totalAnimaux}</span>
          </div>
          <div className="text-[10px] text-terra-muted">espèces vues</div>
        </div>
      </div>

      {/* Barre de progression globale */}
      <div className="h-1 bg-terra-100 rounded-sm overflow-hidden mb-4">
        <div
          className="h-full bg-terra-500 rounded-sm transition-[width] duration-500"
          style={{ width: `${pctVus}%` }}
        />
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-2 bg-terra-100 border border-terra-border rounded-xl px-3.5 py-2 mb-3">
        <Search className="w-4 h-4 text-terra-muted" strokeWidth={2} />
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher une espèce…"
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


      {/* Compteur de résultats */}
      <div className="text-xs text-terra-muted mb-3">
        {resultatsTries.length} espèce
        {resultatsTries.length !== 1 ? 's' : ''}
        {rechercheNorm && ` pour « ${recherche} »`}
      </div>

      {/* Grille 3 colonnes ou message vide */}
      {resultatsTries.length === 0 ? (
        <div className="text-center py-8 text-terra-muted text-sm">
          Aucune espèce ne correspond
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {resultatsTries.map((animal) => (
            <CarteFaune
              key={animal.nom}
              animal={animal}
              vu={estVu(animal)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Faune;