import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ChevronRight, FileText, Files } from 'lucide-react';
import { SECTIONS } from '../donnees/enquetes';
import escapes from '../donnees/escapes.json';
import { db } from '../db';

function Vignette({ image }) {
  return (
    <div
      className="relative w-[84px] shrink-0 rounded-xl overflow-hidden border border-[rgba(60,40,20,0.35)] bg-[#5a4a36] shadow-[inset_0_0_18px_rgba(30,15,5,0.4)]"
      style={{ backgroundImage: `linear-gradient(135deg,rgba(0,0,0,0.15),rgba(0,0,0,0.45)),url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
  );
}

function Tag({ section, casFaitesCles }) {
  if (section.type === 'liste') {
    const casArr = section.cas ?? [];
    const n = casArr.length;
    const faites = casArr.filter((c) => casFaitesCles.has(`${section.id}:${c.id}`)).length;
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-sepia">
        <Files className="w-3 h-3" strokeWidth={2} />
        {n > 0 ? `${faites} / ${n} affaires` : '0 affaire'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-sepia">
      <FileText className="w-3 h-3" strokeWidth={2} />
      PDF
    </span>
  );
}

export default function Enquetes() {
  const escapesListe = escapes.communaute ?? [];
  const escapesFaitesDB = useLiveQuery(() => db.escapesFaits.toArray(), []) ?? [];
  const escapesFaitesIds = useMemo(() => new Set(escapesFaitesDB.map((f) => f.id)), [escapesFaitesDB]);
  const nbEscapes = escapesListe.length;
  const nbEscapesFaits = escapesListe.filter((e) => escapesFaitesIds.has(e.id)).length;

  const casFaitesDB = useLiveQuery(() => db.casFaits.toArray(), []) ?? [];
  const casFaitesCles = useMemo(() => new Set(casFaitesDB.map((f) => f.id)), [casFaitesDB]);

  return (
    <div className="fond-carte-enquete relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[24px] text-encre font-semibold text-center -mt-6">Énigmes</h1>
        <p className="text-center text-[12.5px] text-sepia mt-0.5">Enquêtes et escapes à résoudre</p>
      </div>

      {/* Liste des sections */}
      <div className="relative px-[18px] pt-4 pb-6 flex flex-col gap-3">
        {SECTIONS.map((s) => (
          <Link key={s.id} to={`/jeux/enquetes/${s.id}`}
                className="flex gap-3.5 items-stretch bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-3 shadow-[0_4px_12px_rgba(60,40,20,0.12)] transition-transform duration-200 hover:-translate-y-0.5">
            <Vignette image={s.image} />
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <h3 className="font-serif text-[16px] leading-tight text-encre font-semibold m-0">{s.titre}</h3>
                <p className="text-[11.5px] text-encre-douce mt-1 leading-snug">{s.sousTitre}</p>
              </div>
              <div className="mt-2"><Tag section={s} casFaitesCles={casFaitesCles} /></div>
            </div>
            <ChevronRight className="self-center shrink-0 w-5 h-5 text-encre/40" strokeWidth={2} />
          </Link>
        ))}

        {/* Escapes — regroupé ici avec les enquêtes */}
        <Link to="/jeux/escapes"
              className="flex gap-3.5 items-stretch bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-3 shadow-[0_4px_12px_rgba(60,40,20,0.12)] transition-transform duration-200 hover:-translate-y-0.5">
          <Vignette image="/images/jeux/escapes/vignette.jpg" />
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <h3 className="font-serif text-[16px] leading-tight text-encre font-semibold m-0">Escapes</h3>
              <p className="text-[11.5px] text-encre-douce mt-1 leading-snug">Échappe-toi de lieux légendaires remplis d'énigmes.</p>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-sepia">
                <Files className="w-3 h-3" strokeWidth={2} />
                {nbEscapes > 0 ? `${nbEscapesFaits} / ${nbEscapes} faits` : 'Aucun téléchargé'}
              </span>
            </div>
          </div>
          <ChevronRight className="self-center shrink-0 w-5 h-5 text-encre/40" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}