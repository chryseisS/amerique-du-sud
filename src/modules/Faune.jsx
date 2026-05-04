import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import faune from '../donnees/faune.json';
import { HABITATS, HABITATS_ORDRE } from '../donnees/constantes';
import CarteFaune from '../composants/CarteFaune';

function Faune() {
  // ─── ÉTATS ──────────────────────────────────────────
  const [habitatActif, setHabitatActif] = useState('Tous');
  const [statutActif, setStatutActif] = useState('Tous');
  const [recherche, setRecherche] = useState('');

  // Pour l'instant, statut vu/pas vu en local (Set des noms vus)
  // Plus tard : remplacé par un useLiveQuery sur Dexie
  // eslint-disable-next-line no-unused-vars
  const [animauxVus, _setAnimauxVus] = useState(new Set());

  // Helper : un animal est-il vu ?
  const estVu = (animal) => animauxVus.has(animal.nom);

  // ─── FILTRAGE ───────────────────────────────────────
  const rechercheNorm = recherche.trim().toLowerCase();

  // Filtre par habitat — un animal peut avoir plusieurs habitats
  const parHabitat =
    habitatActif === 'Tous'
      ? faune
      : faune.filter((a) => a.habitats.includes(habitatActif));

  // Filtre par statut
  const parStatut = parHabitat.filter((a) => {
    if (statutActif === 'Tous') return true;
    if (statutActif === 'Vus') return estVu(a);
    if (statutActif === 'AVoir') return !estVu(a);
    if (statutActif === 'Rares') return a.rarete === 3;
    return true;
  });

  // Filtre par texte (sur le nom uniquement)
  const resultats = rechercheNorm
    ? parStatut.filter((a) => a.nom.toLowerCase().includes(rechercheNorm))
    : parStatut;

  // Tri par numéro Pokédex croissant
  const resultatsTries = [...resultats].sort((a, b) => a.numero - b.numero);

  // ─── COMPTEURS ──────────────────────────────────────
  const totalVus = faune.filter(estVu).length;
  const totalAnimaux = faune.length;
  const pctVus = totalAnimaux > 0 ? (totalVus / totalAnimaux) * 100 : 0;

  // Compte le nombre d'animaux par habitat (pour les chips)
  const compterHabitat = (habitat) =>
    faune.filter((a) => a.habitats.includes(habitat)).length;

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
          className="h-full bg-terra-500 rounded-sm"
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

      {/* Filtres HABITAT — chips scrollables */}
      <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
        {/* Chip "Tous" */}
        <ChipHabitat
          actif={habitatActif === 'Tous'}
          onClick={() => setHabitatActif('Tous')}
          libelle="Tous"
          compteur={totalAnimaux}
        />
        {/* Une chip par habitat */}
        {HABITATS_ORDRE.map((cle) => {
          const compteur = compterHabitat(cle);
          // On masque les habitats vides pour ne pas afficher des chips inutiles
          if (compteur === 0) return null;
          return (
            <ChipHabitat
              key={cle}
              actif={habitatActif === cle}
              onClick={() => setHabitatActif(cle)}
              libelle={`${HABITATS[cle].icone} ${HABITATS[cle].libelle}`}
              compteur={compteur}
            />
          );
        })}
      </div>

      {/* Filtres STATUT */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {[
          { cle: 'Tous', libelle: 'Tous' },
          { cle: 'Vus', libelle: '✓ Vus' },
          { cle: 'AVoir', libelle: 'À voir' },
          { cle: 'Rares', libelle: '★★★ Rares' },
        ].map(({ cle, libelle }) => {
          const actif = statutActif === cle;
          return (
            <button
              key={cle}
              onClick={() => setStatutActif(cle)}
              className={
                actif
                  ? 'px-3 py-1 rounded-full text-xs bg-terra-500 text-white border border-terra-500'
                  : 'px-3 py-1 rounded-full text-xs bg-terra-100 text-terra-muted border border-terra-border'
              }
            >
              {libelle}
            </button>
          );
        })}
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

// ─── Sous-composant : chip d'habitat avec compteur intégré ───
function ChipHabitat({ actif, onClick, libelle, compteur }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs whitespace-nowrap border ${
        actif
          ? 'bg-terra-500 text-white border-terra-500'
          : 'bg-terra-100 text-terra-muted border-terra-border'
      }`}
    >
      <span>{libelle}</span>
      <span className={actif ? 'text-white/70' : 'text-terra-muted/60'}>
        {compteur}
      </span>
    </button>
  );
}

export default Faune;
