import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import premieresFois from '../donnees/premieresFois.json';
import CartePremiereFois from '../composants/CartePremiereFois';

function PremieresFois() {
  // ─── ÉTATS ──────────────────────────────────────────
  const [statutActif, setStatutActif] = useState('Tous');
  const [recherche, setRecherche] = useState('');

  // Premières fois faites (Set des noms) — sera remplacé par Dexie plus tard
  const [faites, setFaites] = useState(new Set());

  // ─── HANDLERS ───────────────────────────────────────
  const toggleFait = (nom) => {
    setFaites((ancien) => {
      const nouveau = new Set(ancien);
      if (nouveau.has(nom)) nouveau.delete(nom);
      else nouveau.add(nom);
      return nouveau;
    });
  };

  // ─── FILTRAGE ───────────────────────────────────────
  const rechercheNorm = recherche.trim().toLowerCase();

  const parStatut = premieresFois.filter((p) => {
    if (statutActif === 'Tous') return true;
    if (statutActif === 'Faites') return faites.has(p.nom);
    if (statutActif === 'PasFaites') return !faites.has(p.nom);
    return true;
  });

  const resultats = rechercheNorm
    ? parStatut.filter((p) => p.nom.toLowerCase().includes(rechercheNorm))
    : parStatut;

  // ─── COMPTEURS ──────────────────────────────────────
  const totalFaites = faites.size;
  const totalPremieres = premieresFois.length;
  const pctFaites = totalPremieres > 0 ? (totalFaites / totalPremieres) * 100 : 0;

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

      {/* En-tête : titre + compteur */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-3xl font-serif text-terra-900 leading-tight">
            1ères Fois
          </h1>
          <div className="text-[10px] uppercase tracking-wider text-terra-muted mt-0.5">
            les expériences à vivre
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium text-terra-500">
            {totalFaites}
            <span className="text-terra-muted font-normal"> / {totalPremieres}</span>
          </div>
          <div className="text-[10px] text-terra-muted">accomplies</div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="h-1 bg-terra-100 rounded-sm overflow-hidden mb-4">
        <div
          className="h-full bg-terra-500 rounded-sm"
          style={{ width: `${pctFaites}%` }}
        />
      </div>

      {/* Champ de recherche */}
      <div className="flex items-center gap-2 bg-terra-100 border border-terra-border rounded-xl px-3.5 py-2 mb-3">
        <Search className="w-4 h-4 text-terra-muted" strokeWidth={2} />
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher une expérience…"
          className="flex-1 bg-transparent outline-none text-sm text-terra-900 placeholder:text-terra-muted min-w-0"
        />
        {recherche && (
          <button
            onClick={() => setRecherche('')}
            className="text-terra-muted hover:text-terra-500 flex-shrink-0"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Filtres STATUT — toujours visibles */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {[
          { cle: 'Tous', libelle: 'Toutes' },
          { cle: 'Faites', libelle: '✓ Faites' },
          { cle: 'PasFaites', libelle: 'Pas faites' },
        ].map(({ cle, libelle }) => {
          const actif = cle === statutActif;
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
        {resultats.length} expérience{resultats.length !== 1 ? 's' : ''}
        {rechercheNorm && ` pour « ${recherche} »`}
      </div>

      {/* Liste des premières fois */}
      {resultats.length === 0 ? (
        <div className="text-center py-8 text-terra-muted text-sm">
          Aucune expérience ne correspond
        </div>
      ) : (
        resultats.map((premiere) => (
          <CartePremiereFois
            key={premiere.nom}
            premiere={premiere}
            fait={faites.has(premiere.nom)}
            onToggle={() => toggleFait(premiere.nom)}
          />
        ))
      )}
    </div>
  );
}

export default PremieresFois;
