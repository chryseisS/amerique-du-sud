import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ChevronRight, FileText, Check } from 'lucide-react';
import { db } from '../db';
import escapes from '../donnees/escapes.json';
import { cheminImage } from '../utils/cheminImage';


/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « ESCAPES »  — route /jeux/escapes
   ──────────────────────────────────────────────────────────────────
   • Regroupé sous Énigmes : accessible depuis une carte dans
     Enquetes.jsx.
   • Uniquement la liste des escapes téléchargés (escapes.communaute).
   • Le statut "fait" est lu depuis Dexie (table `escapesFaits`, clé =
     id de l'escape) — le bouton qui écrit dans cette table doit être
     ajouté dans composants/SectionEscape.jsx (pas encore fait, je n'ai
     pas ce fichier). En attendant, cet écran affichera 0 fait partout.
     À ajouter au schéma db.js si absent : escapesFaits: 'id, date'
   ════════════════════════════════════════════════════════════════════ */

function Vignette({ image }) {
  return (
    <div
      className="relative w-[84px] shrink-0 rounded-xl overflow-hidden border border-[rgba(60,40,20,0.35)] bg-[#5a4a36] shadow-[inset_0_0_18px_rgba(30,15,5,0.4)]"
      style={{ backgroundImage: `linear-gradient(135deg,rgba(0,0,0,0.15),rgba(0,0,0,0.45)),url('${cheminImage(image)}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
  );
}

function Tag() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-sepia">
      <FileText className="w-3 h-3" strokeWidth={2} />
      PDF
    </span>
  );
}

const CARTE = 'flex gap-3.5 items-stretch bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-3 shadow-[0_4px_12px_rgba(60,40,20,0.12)] transition-transform duration-200 hover:-translate-y-0.5';

function CarteEscape({ titre, sousTitre, image, escapeId, fait }) {
  return (
    <Link to={`/jeux/escapes/${escapeId}`} className={`${CARTE} ${fait ? 'opacity-70' : ''}`}>
      <Vignette image={image} />
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h3 className="font-serif text-[16px] leading-tight text-encre font-semibold m-0">{titre}</h3>
          <p className="text-[11.5px] text-encre-douce mt-1 leading-snug">{sousTitre}</p>
        </div>
        <div className="mt-2 flex items-center gap-2.5">
          <Tag />
          {fait && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-vert-cta">
              <Check className="w-3 h-3" strokeWidth={2.5} />Fait
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="self-center shrink-0 w-5 h-5 text-encre/40" strokeWidth={2} />
    </Link>
  );
}

// ─── ÉCRAN PRINCIPAL ──────────────────────────────────────────────────
export default function Escapes() {
  const liste = escapes.communaute ?? [];

  const faitesDB = useLiveQuery(() => db.escapesFaits.toArray(), []) ?? [];
  const faitesIds = useMemo(() => new Set(faitesDB.map((f) => f.id)), [faitesDB]);

  const total = liste.length;
  const faits = liste.filter((e) => faitesIds.has(e.id)).length;

  return (
    <div className="fond-carte-escape relative min-h-full">
      <div className="grain-papier" aria-hidden="true" />
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux/enquetes" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[25px] text-encre font-semibold text-center -mt-6">Escapes</h1>
        <p className="text-center text-[12.5px] text-sepia mt-0.5">Tes escapes téléchargés</p>
      </div>

      {/* Progression */}
      {total > 0 && (
        <div className="relative px-5 pt-3.5">
          <div className="text-[12px] text-encre-douce mb-1.5">{faits} / {total} faits</div>
          <div className="h-1.5 rounded-full bg-parchemin-bordure overflow-hidden">
            <div className="h-full bg-vert-cta rounded-full transition-all duration-300"
                 style={{ width: `${(faits / total) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="relative px-[18px] pb-6 pt-3.5 flex flex-col gap-3">
        {liste.length === 0 ? (
          <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
            <p className="text-[13px] text-encre-douce leading-snug">Aucun escape téléchargé pour l'instant.</p>
          </div>
        ) : (
          liste.map((e) => (
            <CarteEscape key={e.id} titre={e.titre} sousTitre={e.sousTitre} image={e.image}
                         escapeId={e.id} fait={faitesIds.has(e.id)} />
          ))
        )}
      </div>
    </div>
  );
}