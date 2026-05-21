import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, X, SlidersHorizontal } from 'lucide-react';
import gastronomie from '../donnees/gastronomie.json';
import { PAYS } from '../donnees/constantes';
import CartePlat from '../composants/CartePlat';
import { useAvisGastronomie } from '../hooks/useAvisGastronomie';

const TYPES_PLATS = ['Plat', 'Boisson', 'Dessert'];

function Gastronomie() {
  // ─── ÉTATS UI ───────────────────────────────────────
  const [paysActif, setPaysActif] = useState('Tous');
  const [typeActif, setTypeActif] = useState('Tous');
  const [statutActif, setStatutActif] = useState('Tous');
  const [recherche, setRecherche] = useState('');
  const [filtresOuverts, setFiltresOuverts] = useState(false);

  // ─── DB (live) ──────────────────────────────────────
  const { testeSet, avisDe, ajouterAvis, supprimerAvis } = useAvisGastronomie();

  // ─── FILTRAGE ───────────────────────────────────────
  const rechercheNorm = recherche.trim().toLowerCase();

  const parPays =
    paysActif === 'Tous'
      ? gastronomie
      : gastronomie.filter((p) => p.pays.includes(paysActif));

  const parType =
    typeActif === 'Tous'
      ? parPays
      : parPays.filter((p) => p.type === typeActif);

  const parStatut = parType.filter((p) => {
    if (statutActif === 'Tous') return true;
    if (statutActif === 'Testés') return testeSet.has(p.nom);
    if (statutActif === 'PasTestes') return !testeSet.has(p.nom);
    return true;
  });

  const filtres = rechercheNorm
    ? parStatut.filter((p) => p.nom.toLowerCase().includes(rechercheNorm))
    : parStatut;

  const ORDRE_TYPES = { Boisson: 0, Plat: 1, Dessert: 2 };
  const ORDRE_PAYS = Object.fromEntries(PAYS.map((p, i) => [p, i]));

  const resultats = [...filtres].sort((a, b) => {
    const dt = (ORDRE_TYPES[a.type] ?? 99) - (ORDRE_TYPES[b.type] ?? 99);
    if (dt !== 0) return dt;

    const paysA = Array.isArray(a.pays) ? a.pays[0] : a.pays;
    const paysB = Array.isArray(b.pays) ? b.pays[0] : b.pays;
    const dp = (ORDRE_PAYS[paysA] ?? 99) - (ORDRE_PAYS[paysB] ?? 99);
    if (dp !== 0) return dp;

    // Non-testés en haut
    const testeA = testeSet.has(a.nom) ? 1 : 0;
    const testeB = testeSet.has(b.nom) ? 1 : 0;
    return testeA - testeB;
  });

  // ─── COMPTEURS ──────────────────────────────────────
  const totalTestes = testeSet.size;
  const totalPlats = gastronomie.length;
  const pctTestes = totalPlats > 0 ? (totalTestes / totalPlats) * 100 : 0;

  // ─── FILTRES ACTIFS ─────────────────────────────────
  const filtresActifs = [];
  if (paysActif !== 'Tous') {
    filtresActifs.push({ cle: 'pays', libelle: paysActif, retirer: () => setPaysActif('Tous') });
  }
  if (typeActif !== 'Tous') {
    filtresActifs.push({ cle: 'type', libelle: typeActif, retirer: () => setTypeActif('Tous') });
  }
  if (statutActif !== 'Tous') {
    filtresActifs.push({
      cle: 'statut',
      libelle: statutActif === 'Testés' ? '✓ Testés' : 'Pas testés',
      retirer: () => setStatutActif('Tous'),
    });
  }
  const aFiltresActifs = filtresActifs.length > 0;

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

      {/* Recherche + bouton filtres */}
      <div className="flex gap-2 mb-2">
        <div className="flex-1 flex items-center gap-2 bg-terra-100 border border-terra-border rounded-xl px-3.5 py-2">
          <Search className="w-4 h-4 text-terra-muted" strokeWidth={2} />
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un plat…"
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

        <button
          onClick={() => setFiltresOuverts((v) => !v)}
          className={`relative px-3 rounded-xl border flex items-center justify-center flex-shrink-0 ${
            filtresOuverts || aFiltresActifs
              ? 'bg-terra-500 border-terra-500 text-white'
              : 'bg-terra-100 border-terra-border text-terra-muted'
          }`}
          aria-label="Filtres"
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
          {aFiltresActifs && !filtresOuverts && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 border border-terra-50" />
          )}
        </button>
      </div>

      {/* Filtres actifs (badges) */}
      {aFiltresActifs && !filtresOuverts && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {filtresActifs.map(({ cle, libelle, retirer }) => (
            <button
              key={cle}
              onClick={retirer}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-terra-500/10 text-terra-500 border border-terra-500/30"
            >
              <span>{libelle}</span>
              <X className="w-3 h-3" strokeWidth={2.5} />
            </button>
          ))}
        </div>
      )}

      {/* Panneau de filtres */}
      {filtresOuverts && (
        <div className="bg-terra-100 border border-terra-border rounded-xl p-3 mb-3">
          <div className="mb-3">
            <div className="text-[10px] uppercase tracking-wider text-terra-muted mb-1.5">Pays</div>
            <div className="flex gap-1.5 flex-wrap">
              {['Tous', ...PAYS].map((pays) => {
                const actif = pays === paysActif;
                return (
                  <button
                    key={pays}
                    onClick={() => setPaysActif(pays)}
                    className={actif
                      ? 'px-3 py-1 rounded-full text-xs bg-terra-500 text-white border border-terra-500'
                      : 'px-3 py-1 rounded-full text-xs bg-terra-50 text-terra-muted border border-terra-border'}
                  >
                    {pays}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] uppercase tracking-wider text-terra-muted mb-1.5">Type</div>
            <div className="flex gap-1.5 flex-wrap">
              {['Tous', ...TYPES_PLATS].map((type) => {
                const actif = type === typeActif;
                return (
                  <button
                    key={type}
                    onClick={() => setTypeActif(type)}
                    className={actif
                      ? 'px-3 py-1 rounded-full text-xs bg-terra-500 text-white border border-terra-500'
                      : 'px-3 py-1 rounded-full text-xs bg-terra-50 text-terra-muted border border-terra-border'}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-terra-muted mb-1.5">Statut</div>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { cle: 'Tous', libelle: 'Tous' },
                { cle: 'Testés', libelle: '✓ Testés' },
                { cle: 'PasTestes', libelle: 'Pas testés' },
              ].map(({ cle, libelle }) => {
                const actif = cle === statutActif;
                return (
                  <button
                    key={cle}
                    onClick={() => setStatutActif(cle)}
                    className={actif
                      ? 'px-3 py-1 rounded-full text-xs bg-terra-500 text-white border border-terra-500'
                      : 'px-3 py-1 rounded-full text-xs bg-terra-50 text-terra-muted border border-terra-border'}
                  >
                    {libelle}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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