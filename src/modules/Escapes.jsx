import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Star, Download, ChevronRight, Plus, Backpack, FileText } from 'lucide-react';
import escapes from '../donnees/escapes.json';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « ESCAPES »  — module destiné à une route /jeux/escapes
   ──────────────────────────────────────────────────────────────────
   • Les données sont dans ../donnees/escapes.json
   • Tu n'édites que les IMAGES (champ `image:` du JSON).
     Dépose-les dans public/images/jeux/escapes/…
   • La barre du bas N'EST PAS ici : dans ton app, App.jsx rend déjà
     <BarreOnglets/> (Planif/Apprendre/Jeux/Journal) sous ce module.
   ════════════════════════════════════════════════════════════════════ */

const ONGLETS = [
  { id: 'home', label: 'Home made', Icone: Star },
  { id: 'dl',   label: 'Downloaded', Icone: Download },
];

// ─── Sous-éléments ────────────────────────────────────────────────────
function Vignette({ image }) {
  return (
    <div
      className="relative w-[84px] shrink-0 rounded-xl overflow-hidden border border-[rgba(60,40,20,0.35)] bg-[#5a4a36] shadow-[inset_0_0_18px_rgba(30,15,5,0.4)]"
      style={{ backgroundImage: `linear-gradient(135deg,rgba(0,0,0,0.15),rgba(0,0,0,0.45)),url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
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
}// Style partagé (classes)
const CARTE = 'flex gap-3.5 items-stretch bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-3 shadow-[0_4px_12px_rgba(60,40,20,0.12)] transition-transform duration-200 hover:-translate-y-0.5';

function CarteEscape({ titre, sousTitre, image, isDownloaded, escapeId }) {
  const content = (
    <>
      <Vignette image={image} />
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h3 className="font-serif text-[16px] leading-tight text-encre font-semibold m-0">{titre}</h3>
          <p className="text-[11.5px] text-encre-douce mt-1 leading-snug">{sousTitre}</p>
        </div>
        {isDownloaded && (
          <div className="mt-2">
            <Tag />
          </div>
        )}
      </div>
      <ChevronRight className="self-center shrink-0 w-5 h-5 text-encre/40" strokeWidth={2} />
    </>
  );

  if (isDownloaded) {
    return (
      <Link to={`/jeux/escapes/${escapeId}`} className={CARTE}>
        {content}
      </Link>
    );
  }

  return (
    <div className={CARTE}>
      {content}
    </div>
  );
}

// ─── ÉCRAN PRINCIPAL ──────────────────────────────────────────────────
export default function Escapes() {
  const location = useLocation();
  const [onglet, setOnglet] = useState(location.state?.onglet || 'home');

  return (
    <div className="fond-carte-escape relative min-h-full">
      <div className="grain-papier" aria-hidden="true" />
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[25px] text-encre font-semibold text-center -mt-6">Escapes</h1>
        <p className="text-center text-[12.5px] text-sepia mt-0.5">Choisis ton univers</p>
      </div>

      {/* Onglets segmentés */}
      <div className="relative px-5 pt-3.5 pb-1.5">
        <div className="flex bg-[rgba(120,90,50,0.10)] rounded-xl p-1 border border-parchemin-bordure">
          {ONGLETS.map(({ id, label, Icone }) => {
            const actif = onglet === id;
            return (
              <button key={id} onClick={() => setOnglet(id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[9px] uppercase tracking-wider text-[12.5px] transition-all ${actif ? 'bg-parchemin-carte text-encre font-bold shadow-[0_1px_4px_rgba(60,40,20,0.18)]' : 'text-[#9c855f] font-medium'}`}>
                <Icone className="w-[15px] h-[15px]" strokeWidth={2} fill={actif && id === 'home' ? 'currentColor' : 'transparent'} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Liste */}
      <div className="relative px-[18px] pb-6 pt-1 flex flex-col gap-3">
        {onglet === 'home'
          ? escapes.homeMade.map((e) => (
              <CarteEscape
                key={e.id}
                titre={e.titre}
                sousTitre={e.sousTitre}
                image={e.image}
                isDownloaded={false}
              />
            ))
          : (
            <>
              {escapes.communaute.map((e) => (
                <CarteEscape
                  key={e.id}
                  titre={e.titre}
                  sousTitre={e.sousTitre}
                  image={e.image}
                  isDownloaded={true}
                  escapeId={e.id}
                />
              ))}
            </>
          )}
      </div>
    </div>
  );
}