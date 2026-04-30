import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronDown, Check, PenLine, TrendingUp } from 'lucide-react';
import { PAYS } from '../donnees/constantes';

function Journal() {
  // État local du pays — sera remplacé plus tard par le Context partagé
  const [pays, setPays] = useState('Pérou');
  const [menuOuvert, setMenuOuvert] = useState(false);

  // Données fake pour l'instant — chaque module sera vraiment branché plus tard
  const stats = {
    journal: { nombre: 12 },
    faune: { fait: 7, total: 24 },
    gastronomie: { fait: 5, total: 12 },
    premieresFois: { fait: 3, total: 15 },
  };

  // Petite fonction utilitaire pour le pourcentage de la barre de progression
  const pct = (fait, total) => (total > 0 ? (fait / total) * 100 : 0);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-serif text-terra-900 mb-3">Journal</h1>

      {/* ─── Sélecteur de pays ─── */}
      <div className="relative mb-4">
        <button
          onClick={() => setMenuOuvert((v) => !v)}
          className="w-full flex items-center gap-3 bg-gradient-to-r from-terra-500/8 to-terra-500/0 border border-terra-500/25 rounded-xl px-3.5 py-2.5"
        >
          <MapPin className="w-[18px] h-[18px] text-terra-500" strokeWidth={2} />
          <div className="flex-1 text-left">
            <div className="text-[10px] uppercase tracking-wider text-terra-muted leading-none mb-0.5">
              Voyage en cours
            </div>
            <div className="font-serif text-lg text-terra-900 leading-none">
              {pays}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-terra-500 transition-transform ${menuOuvert ? 'rotate-180' : ''}`}
            strokeWidth={2}
          />
        </button>

        {/* Menu déroulant */}
        {menuOuvert && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-terra-100 border border-terra-500/25 rounded-xl shadow-lg overflow-hidden z-10">
            {PAYS.map((p, i) => {
              const actif = p === pays;
              return (
                <button
                  key={p}
                  onClick={() => {
                    setPays(p);
                    setMenuOuvert(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3.5 py-2.5 font-serif text-base text-left ${
                    actif
                      ? 'bg-terra-500/8 text-terra-500'
                      : 'text-terra-900'
                  } ${i > 0 ? 'border-t border-terra-border' : ''}`}
                >
                  <span className="flex-1">{p}</span>
                  {actif && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Bento ─── */}
      <div className="grid grid-cols-2 gap-2.5">

        {/* Journal de bord — pleine largeur, fond accent */}
        <Link
          to="/journal/bord"
          className="col-span-2 bg-terra-500 rounded-2xl p-4 relative overflow-hidden"
        >
          <div className="absolute -top-2.5 -right-2.5 w-20 h-20 bg-white/8 rounded-full" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <PenLine className="w-6 h-6 text-white/95" strokeWidth={1.7} />
              <div className="font-serif text-lg text-white leading-tight">
                Journal de bord
              </div>
            </div>
            <div className="text-right">
              <div className="font-serif text-lg text-white/95 leading-none">
                {stats.journal.nombre}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-white/60 mt-0.5">
                entrées
              </div>
            </div>
          </div>
        </Link>

        {/* Faune */}
        <CarteBento
          to="/journal/faune"
          titre="Faune"
          emoji="🦙"
          fait={stats.faune.fait}
          total={stats.faune.total}
          pct={pct(stats.faune.fait, stats.faune.total)}
        />

        {/* Gastronomie */}
        <CarteBento
          to="/journal/gastronomie"
          titre="Gastronomie"
          emoji="🌶️"
          fait={stats.gastronomie.fait}
          total={stats.gastronomie.total}
          pct={pct(stats.gastronomie.fait, stats.gastronomie.total)}
        />

        {/* Premières fois — pleine largeur */}
        <Link
          to="/journal/premieres-fois"
          className="col-span-2 bg-terra-100 border border-terra-border rounded-2xl p-3.5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-terra-500/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-[18px] h-[18px] text-terra-500" strokeWidth={1.7} />
            </div>
            <div className="flex-1 font-serif text-base text-terra-900 leading-tight">
              Premières fois
            </div>
            <div className="text-xs font-medium text-terra-muted">
              {stats.premieresFois.fait}
              <span className="text-terra-muted/50">/{stats.premieresFois.total}</span>
            </div>
          </div>
          <div className="h-[3px] bg-terra-muted/12 rounded-sm overflow-hidden mt-3">
            <div
              className="h-full bg-terra-500 rounded-sm"
              style={{ width: `${pct(stats.premieresFois.fait, stats.premieresFois.total)}%` }}
            />
          </div>
        </Link>

      </div>
    </div>
  );
}

// ─── Sous-composant local pour les cartes Faune et Gastronomie ───
function CarteBento({ to, titre, emoji, fait, total, pct }) {
  return (
    <Link
      to={to}
      className="bg-terra-100 border border-terra-border rounded-2xl p-3.5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-full bg-terra-500/10 flex items-center justify-center text-lg">
          {emoji}
        </div>
        <div className="text-xs font-medium text-terra-muted">
          {fait}
          <span className="text-terra-muted/50">/{total}</span>
        </div>
      </div>
      <div className="font-serif text-base text-terra-900 leading-tight mb-2.5">
        {titre}
      </div>
      <div className="h-[3px] bg-terra-muted/12 rounded-sm overflow-hidden">
        <div
          className="h-full bg-terra-500 rounded-sm"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}

export default Journal;