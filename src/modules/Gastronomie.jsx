import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import gastronomie from '../donnees/gastronomie.json';
import { PAYS } from '../donnees/constantes';
import CartePlat from '../composants/CartePlat';
import { useAvisGastronomie } from '../hooks/useAvisGastronomie';

function Gastronomie() {
  // ─── ÉTATS UI ───────────────────────────────────────
  const [paysActif, setPaysActif] = useState(PAYS[0]);
  const [recherche, setRecherche] = useState('');

  // ─── DB (live) ──────────────────────────────────────
  const { testeSet, avisDe, ajouterAvis, supprimerAvis } = useAvisGastronomie();

  // ─── FILTRAGE ───────────────────────────────────────
  const rechercheNorm = recherche.trim().toLowerCase();

  const parPays = rechercheNorm
    ? gastronomie
    : gastronomie.filter((p) =>
        Array.isArray(p.pays) ? p.pays.includes(paysActif) : p.pays === paysActif
      );

  const filtres = rechercheNorm
    ? parPays.filter((p) => p.nom.toLowerCase().includes(rechercheNorm))
    : parPays;

  const ORDRE_TYPES = { Boisson: 0, Plat: 1, Dessert: 2 };

  const resultats = [...filtres].sort((a, b) => {
    const dt = (ORDRE_TYPES[a.type] ?? 99) - (ORDRE_TYPES[b.type] ?? 99);
    if (dt !== 0) return dt;
    // Non-testés en haut
    const testeA = testeSet.has(a.nom) ? 1 : 0;
    const testeB = testeSet.has(b.nom) ? 1 : 0;
    return testeA - testeB;
  });

  // ─── COMPTEURS ──────────────────────────────────────
  const totalTestes = testeSet.size;
  const totalPlats = gastronomie.length;
  const pctTestes = totalPlats > 0 ? (totalTestes / totalPlats) * 100 : 0;

  // ─── RENDU ──────────────────────────────────────────
  return (
    <div className="p-4">
      {/* Bouton retour */}
      <Link to="/journal" className="flex items-center gap-2 text-terra-500 mb-3">
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </Link>

      {/* En-tête */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-3xl font-serif text-terra-900 leading-tight">
            Gastronomie
          </h1>
          <div className="text-[10px] uppercase tracking-wider text-terra-muted mt-0.5">
            cartes des saveurs
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium text-terra-500">
            {totalTestes}
            <span className="text-terra-muted font-normal"> / {totalPlats}</span>
          </div>
          <div className="text-[10px] text-terra-muted">testés</div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="h-1 bg-terra-100 rounded-sm overflow-hidden mb-4">
        <div
          className="h-full bg-terra-500 rounded-sm transition-[width] duration-500"
          style={{ width: `${pctTestes}%` }}
        />
      </div>

      {/* Filtre pays */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {PAYS.map((pays) => (
          <button
            key={pays}
            onClick={() => setPaysActif(pays)}
            className={
              pays === paysActif
                ? 'px-3 py-1 rounded-full text-xs bg-terra-500 text-white border border-terra-500'
                : 'px-3 py-1 rounded-full text-xs bg-terra-100 text-terra-muted border border-terra-border'
            }
          >
            {pays}
          </button>
        ))}
      </div>

      {/* Recherche */}
      <div className="flex items-center gap-2 bg-terra-100 border border-terra-border rounded-xl px-3.5 py-2 mb-3">
        <Search className="w-4 h-4 text-terra-muted" strokeWidth={2} />
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher…"
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

      {/* Compteur */}
      <div className="text-xs text-terra-muted mb-3">
        {resultats.length} plat{resultats.length !== 1 ? 's' : ''}
        {rechercheNorm && ` pour « ${recherche} »`}
      </div>

      {/* Liste */}
      {resultats.length === 0 ? (
        <div className="text-center py-8 text-terra-muted text-sm">
          Aucun plat ne correspond
        </div>
      ) : (
        resultats.map((plat) => (
          <CartePlat
            key={plat.nom}
            plat={plat}
            avis={avisDe(plat.nom)}
            onAjouter={ajouterAvis}
          />
        ))
      )}
    </div>
  );
}

export default Gastronomie;