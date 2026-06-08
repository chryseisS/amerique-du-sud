import { useState } from 'react';
import { ArrowLeft, Star, Download, Globe, ChevronRight, Plus, Backpack } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « ESCAPES »  — module destiné à une route /jeux/escapes
   ──────────────────────────────────────────────────────────────────
   • Tu n'édites que les IMAGES (champ `image:` des deux tableaux).
     Dépose-les dans public/images/jeux/escapes/… — un fond sépia
     s'affiche tant que le fichier manque.
   • La barre du bas N'EST PAS ici : dans ton app, App.jsx rend déjà
     <BarreOnglets/> (Planif/Apprendre/Jeux/Journal) sous ce module.
   ════════════════════════════════════════════════════════════════════ */

// ─── DONNÉES — onglet « HOME MADE » ───────────────────────────────────
const HOME_MADE = [
  { id: 'temple', titre: 'Le temple oublié',    image: '/images/jeux/escapes/temple-oublie.jpg',  difficulte: 3, meilleurTemps: '08:42' },
  { id: 'potosi', titre: 'La mine de Potosí',   image: '/images/jeux/escapes/mine-potosi.jpg',     difficulte: 4, meilleurTemps: '14:31' },
  { id: 'soleil', titre: 'Le tombeau du Soleil', image: '/images/jeux/escapes/tombeau-soleil.jpg', difficulte: 5, meilleurTemps: '—:—' },
];

// ─── DONNÉES — onglet « DOWNLOADED » (communauté) ─────────────────────
const COMMUNAUTE = [
  { id: 'nazcas',  titre: 'Le secret des Nazcas', auteur: 'Lucas R.',  image: '/images/jeux/escapes/nazcas.jpg', note: 3.5, avis: 124, joueurs: '2 341' },
  { id: 'arica',   titre: "Le phare d'Arica",     auteur: 'Camila L.', image: '/images/jeux/escapes/arica.jpg',  note: 3.5, avis: 98,  joueurs: '1 842' },
  { id: 'sanfran', titre: 'La crypte de San Francisco', auteur: 'Juan P.', image: '/images/jeux/escapes/crypte.jpg', note: 4.5, avis: 156, joueurs: '3 107' },
];

const ONGLETS = [
  { id: 'home', label: 'Home made',  Icone: Star },
  { id: 'dl',   label: 'Downloaded', Icone: Download },
];

// ─── Sous-éléments ────────────────────────────────────────────────────
function Vignette({ image, ruban }) {
  return (
    <div
      className="relative w-[92px] shrink-0 rounded-xl overflow-hidden border border-[rgba(60,40,20,0.35)] bg-[#7a5a36] shadow-[inset_0_0_18px_rgba(30,15,5,0.4)]"
      style={{ backgroundImage: `linear-gradient(135deg,rgba(0,0,0,0.15),rgba(0,0,0,0.4)),url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <span className="absolute top-2 -left-2.5 -rotate-[7deg] bg-[#efe2c6] text-[#6a4a28] text-[9px] font-bold tracking-wide px-3 py-0.5 rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
        {ruban}
      </span>
    </div>
  );
}

function Difficulte({ niveau }) {
  return (
    <span className="inline-flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}
              className={`w-[7px] h-[7px] rounded-full ${n <= niveau ? 'bg-[#7a3a1c]' : 'border border-[#cdb992]'}`} />
      ))}
    </span>
  );
}

function Etoiles({ note }) {
  return (
    <span className="inline-flex gap-[1.5px]">
      {[1, 2, 3, 4, 5].map((n) => {
        const plein = n <= Math.floor(note);
        const demi = !plein && n - 0.5 <= note;
        return (
          <Star key={n} className="w-3 h-3" strokeWidth={1.5} color="#b67a2e"
                fill={plein || demi ? '#d99a3a' : 'transparent'}
                style={{ opacity: demi ? 0.55 : 1 }} />
        );
      })}
    </span>
  );
}

// Tampon « postal » décoratif
function Tampon() {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true"
         className="absolute top-1.5 right-2.5 w-16 h-16 opacity-[0.32] text-[#7a4a28] -rotate-12">
      <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="40" cy="40" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="40" y="44" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor" letterSpacing="1" fontFamily="Georgia, serif">JEUX</text>
    </svg>
  );
}

// Styles partagés (classes)
const CARTE = 'flex gap-3.5 items-stretch bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-3 shadow-[0_4px_12px_rgba(60,40,20,0.12)]';
const MINI_LABEL = 'text-[9.5px] tracking-wider uppercase text-sepia font-semibold';
const BTN_ROND = 'self-center shrink-0 w-[34px] h-[34px] rounded-full flex items-center justify-center bg-[rgba(120,90,50,0.10)] border border-parchemin-bordure';

function CarteHomeMade({ titre, image, difficulte, meilleurTemps }) {
  return (
    <article className={CARTE}>
      <Vignette image={image} ruban="ORIGINAL" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <h3 className="font-serif text-lg leading-tight text-encre font-semibold m-0">{titre}</h3>
        <div className="mt-2">
          <div className={MINI_LABEL}>Difficulté</div>
          <div className="mt-1"><Difficulte niveau={difficulte} /></div>
        </div>
        <div className="mt-2">
          <div className={MINI_LABEL}>Meilleur temps</div>
          <div className="font-serif text-base font-semibold text-encre mt-px">{meilleurTemps}</div>
        </div>
      </div>
      <button aria-label="Ouvrir" className={BTN_ROND}>
        <ChevronRight className="w-5 h-5 text-encre" strokeWidth={2} />
      </button>
    </article>
  );
}

function CarteCommunaute({ titre, auteur, image, note, avis, joueurs }) {
  return (
    <article className={CARTE}>
      <Vignette image={image} ruban="COMMUNAUTÉ" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-[17px] leading-tight text-encre font-semibold m-0">{titre}</h3>
          <div className="text-xs italic text-sepia mt-0.5">par {auteur}</div>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Etoiles note={note} />
          <span className="text-[11px] text-encre-douce">({avis})</span>
        </div>
        <div className="text-[11.5px] text-encre-douce mt-1">{joueurs} joueurs</div>
      </div>
      <button aria-label="Télécharger" className={BTN_ROND}>
        <Download className="w-[18px] h-[18px] text-encre" strokeWidth={2} />
      </button>
    </article>
  );
}

// ─── ÉCRAN PRINCIPAL ──────────────────────────────────────────────────
export default function Escapes() {
  const [onglet, setOnglet] = useState('home');

  return (
    <div className="fond-carte relative min-h-full">
      <div className="grain-papier" aria-hidden="true" />
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Tampon />
        <button aria-label="Retour"
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </button>
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
          ? HOME_MADE.map((e) => <CarteHomeMade key={e.id} {...e} />)
          : (
            <>
              {COMMUNAUTE.map((e) => <CarteCommunaute key={e.id} {...e} />)}
              {/* Encart « créer un escape » */}
              <div className={`${CARTE} items-center`}>
                <div className="flex-1">
                  <h3 className="font-serif text-base text-encre font-semibold m-0">Tu as une idée d'escape ?</h3>
                  <p className="text-xs text-encre-douce mt-1 mb-2.5 leading-snug">
                    Crée le tien et partage-le avec d'autres voyageurs !
                  </p>
                  <button className="inline-flex items-center gap-1.5 bg-vert-cta text-creme rounded-[10px] px-4 py-2.5 text-[12.5px] font-semibold tracking-wide uppercase">
                    <Plus className="w-4 h-4" strokeWidth={2.4} />
                  </button>
                </div>
                <Backpack className="w-12 h-12 text-sepia opacity-55 shrink-0" strokeWidth={1.3} />
              </div>
            </>
          )}
      </div>
    </div>
  );
}