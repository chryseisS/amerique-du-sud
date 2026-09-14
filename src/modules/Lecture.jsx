import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ChevronRight, Check, User } from 'lucide-react';
import { db } from '../db';
import livres from '../donnees/lecture.json';
import { COULEURS_PAYS } from '../donnees/constantes';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « LECTURE »  — route /jeux/medias/lecture
   ──────────────────────────────────────────────────────────────────
   • Données dans ../donnees/lecture.json (schéma : id, titre, auteur,
     pays, description). Pas de champ downloaded — contrairement aux
     films, la lecture ne dépend pas d'un fichier téléchargé.
   • Statut "lu" stocké dans Dexie (table `livresLus`, clé = id du
     livre). À ajouter au schéma db.js si absent :
       livresLus: 'id, date'
   ════════════════════════════════════════════════════════════════════ */

function BadgePays({ pays }) {
  const c = pays ? COULEURS_PAYS[pays] : null;
  if (!c) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
          style={{ backgroundColor: c.iconBg, color: c.iconText }}>
      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.accent }} />
      {pays}
    </span>
  );
}

export default function Lecture() {
  const lusDB = useLiveQuery(() => db.livresLus.toArray(), []) ?? [];
  const lusIds = useMemo(() => new Set(lusDB.map((l) => l.id)), [lusDB]);

  const total = livres.length;
  const lus = livres.filter((l) => lusIds.has(l.id)).length;

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux/medias" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[24px] text-encre font-semibold text-center -mt-6">Lecture</h1>
        <p className="text-center text-[12.5px] text-sepia mt-0.5">Livres pour la route</p>
      </div>

      {/* Progression */}
      {total > 0 && (
        <div className="relative px-5 pt-3">
          <div className="text-[12px] text-encre-douce mb-1.5">{lus} / {total} livres lus</div>
          <div className="h-1.5 rounded-full bg-parchemin-bordure overflow-hidden">
            <div className="h-full bg-vert-cta rounded-full transition-all duration-300"
                 style={{ width: `${(lus / total) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="relative px-[18px] pt-4 pb-6 flex flex-col gap-3">
        {livres.length === 0 ? (
          <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
            <p className="text-[13px] text-encre-douce leading-snug">Aucun livre pour l'instant.</p>
          </div>
        ) : (
          livres.map((l) => {
            const lu = lusIds.has(l.id);
            return (
              <Link key={l.id} to={`/jeux/medias/lecture/${l.id}`}
                    className={`flex flex-col gap-2 bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-4 shadow-[0_4px_12px_rgba(60,40,20,0.12)] transition-transform duration-200 hover:-translate-y-0.5 ${lu ? 'opacity-70' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-[16px] leading-tight text-encre font-semibold m-0">{l.titre}</h3>
                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    {lu && <Check className="w-4 h-4 text-vert-cta" strokeWidth={2.5} />}
                    <ChevronRight className="w-5 h-5 text-encre/40" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {l.auteur && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-encre-douce">
                      <User className="w-3 h-3" strokeWidth={2} />{l.auteur}
                    </span>
                  )}
                  <BadgePays pays={l.pays} />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}