import { Link } from 'react-router-dom';
import { PenLine, UtensilsCrossed, Mountain, Bird } from 'lucide-react';
import faune from '../donnees/faune.json';
import gastronomie from '../donnees/gastronomie.json';
import { useObservationsFaune } from '../hooks/useObservationsFaune';
import { useAvisGastronomie } from '../hooks/useAvisGastronomie';

function Journal() {
  // ─── DB (live) ──────────────────────────────────────
  const { vuSet } = useObservationsFaune();
  const { testeSet } = useAvisGastronomie();

  // ─── Gastro ─────────────────────────────────────────
  const gastro = { fait: testeSet.size, total: gastronomie.length };
  const pctGastro = gastro.total > 0 ? (gastro.fait / gastro.total) * 100 : 0;

  // ─── Pokédex ────────────────────────────────────────
  const fauneFait = vuSet.size;
  const fauneTotal = faune.length;

  // ─── Fake en attendant leurs modules DB ─────────────
  // Journal de bord : pas encore de table en DB
  const last = null;

  // 1ères Fois : pas encore de table en DB
  const premieresFois = { fait: 0, total: 10 };
  const pctPremieres = premieresFois.total > 0 ? (premieresFois.fait / premieresFois.total) * 100 : 0;
  const circonference = 2 * Math.PI * 15;
  const dashPremieres = (pctPremieres / 100) * circonference;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-serif text-terra-900 mb-4">Journal</h1>

      <div className="flex flex-col gap-2.5">

        {/* ═══ LIGNE 1 : Journal (accent) + Gastronomie ═══ */}
        <div className="grid grid-cols-2 gap-2.5">

          {/* ─── Journal de bord ─── */}
          <Link
            to="/journal/bord"
            className="bg-terra-500 rounded-2xl p-3.5 min-h-[130px] flex flex-col justify-between shadow-[0_4px_16px_rgba(201,98,63,0.22)]"
          >
            <PenLine className="w-7 h-7 text-white/95" strokeWidth={1.7} />
            <div>
              <div className="font-serif italic text-lg text-white mb-1 leading-tight">
                Journal
              </div>
              {last ? (
                <>
                  <div className="text-[10px] text-white/70">
                    {last.humeur} {last.lieu} · {last.date}
                  </div>
                  <div className="text-[11px] text-white/85 mt-1 leading-snug line-clamp-2">
                    {last.title || last.body}
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-white/60">Aucune entrée</div>
              )}
            </div>
          </Link>

          {/* ─── Gastronomie — live ─── */}
          <Link
            to="/journal/gastronomie"
            className="bg-terra-100 border border-terra-border rounded-2xl p-3.5 min-h-[130px] flex flex-col justify-between"
          >
            <UtensilsCrossed className="w-7 h-7 text-terra-500" strokeWidth={1.7} />
            <div>
              <div className="font-serif italic text-base text-terra-900 mb-2 leading-tight">
                Gastro
              </div>
              <div className="h-1 bg-terra-500/15 rounded-sm mb-1 overflow-hidden">
                <div
                  className="h-full bg-terra-500 rounded-sm transition-[width] duration-500"
                  style={{ width: `${pctGastro}%` }}
                />
              </div>
              <div className="text-[10px] text-terra-muted">
                {gastro.fait}/{gastro.total} goûtés
              </div>
            </div>
          </Link>
        </div>

        {/* ═══ LIGNE 2 : 1ères Fois + Pokédex ═══ */}
        <div className="grid grid-cols-2 gap-2.5">

          {/* ─── 1ères Fois — fake en attendant ─── */}
          <Link
            to="/journal/premieres-fois"
            className="bg-terra-900/85 rounded-2xl p-3.5 min-h-[150px] flex flex-col justify-between"
          >
            <Mountain className="w-7 h-7 text-white/90" strokeWidth={1.7} />
            <div>
              <div className="font-serif italic text-base text-white mb-2 leading-tight">
                1ères Fois
              </div>
              <div className="flex items-center gap-2">
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${dashPremieres} ${circonference}`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                    className="text-terra-500"
                  />
                  <text
                    x="18" y="22"
                    textAnchor="middle"
                    fontSize="10"
                    fill="white"
                    fontFamily="system-ui"
                    fontWeight="700"
                  >
                    {premieresFois.fait}
                  </text>
                </svg>
                <div className="text-[11px] text-white/60 leading-snug">
                  sur {premieresFois.total}<br />accomplis
                </div>
              </div>
            </div>
          </Link>

          {/* ─── Pokédex — live ─── */}
          <Link
            to="/journal/faune"
            className="bg-terra-900 rounded-2xl p-3.5 min-h-[150px] flex flex-col justify-between"
          >
            <Bird className="w-7 h-7 text-white/90" strokeWidth={1.7} />
            <div>
              <div className="font-serif italic text-base text-white mb-2 leading-tight">
                Pokédex
              </div>
              {/* Mini-points : allumés si l'animal est observé */}
              <div className="flex flex-wrap gap-1 mb-1.5">
                {faune.slice(0, 10).map((animal) => (
                  <div
                    key={animal.nom}
                    className={`w-2 h-2 rounded-sm transition-colors duration-300 ${
                      vuSet.has(animal.nom) ? 'bg-terra-500' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
              <div className="text-[10px] text-white/55">
                {fauneFait}/{fauneTotal} observés
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Journal;