import { Link } from 'react-router-dom';

// Icônes : place tes 3 SVG dans public/images/jeux/icones/
//   quiz.svg · enquetes.svg · escapes.svg

// ─── Données des 3 cartes (tout s'édite ici) ──────────────────────────
const CARTES = [
  {
    id: 'quiz', titre: 'Quiz', to: '/jeux/quiz', icone: '/images/jeux/icones/quiz.svg', badge: '3 modes', couleur: 'bg-jeu-quiz',
    desc: 'Teste tes connaissances sur l’histoire, la culture et la géographie.',
  },
  {
    id: 'enquetes', titre: 'Enquêtes', to: '/jeux/enquetes', icone: '/images/jeux/icones/enquetes.svg', badge: '2 séries', couleur: 'bg-jeu-enquete',
    desc: 'Résous des affaires mystérieuses dans des séries captivantes.',
  },
  {
    id: 'escapes', titre: 'Escapes', to: '/jeux/escapes', icone: '/images/jeux/icones/escapes.svg', badge: '2 onglets', couleur: 'bg-jeu-escape',
    desc: 'Échappe-toi de lieux légendaires remplis d’énigmes.',
  },
];



export default function Jeux() {
  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />


      {/* En-tête */}
      <div className="relative px-6 pt-6 pb-4">
        <div className="text-[11px] tracking-[0.2em] font-semibold text-sepia mt-4">AIRE DE JEU</div>
        <h1 className="font-serif text-[52px] leading-none text-encre font-semibold mt-0.5">Jeux</h1>
        <p className="text-encre-douce text-[13.5px] leading-relaxed max-w-[215px] mt-2.5">
          Explore, résous, réponds et échappe-toi à travers l’Amérique du Sud.
        </p>
      </div>

      {/* Cartes */}
      <div className="relative px-5 pt-1 pb-6 flex flex-col gap-3.5">
        {CARTES.map(({ id, titre, desc, badge, icone, couleur, to }) => (
          <Link key={id} to={to}
                  className={`relative text-left rounded-[20px] p-[17px] border border-creme/15 ${couleur} texture-cuir shadow-[0_8px_22px_rgba(40,20,8,0.28)] transition-transform duration-200 hover:-translate-y-0.5`}>
            <div className="flex items-start gap-3.5">
              <div className="shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center bg-creme/10 border border-creme/30">
                <img src={icone} alt="" className="w-6 h-6" />
              </div>
              <div className="pr-14">
                <div className="font-serif text-2xl text-creme leading-none font-semibold">{titre}</div>
                <p className="text-[12.5px] leading-snug text-creme/70 mt-1.5">{desc}</p>
              </div>
            </div>
            <span className="absolute right-3.5 bottom-3 bg-black/25 text-creme text-[11px] font-semibold px-2.5 py-[3px] rounded-lg border border-creme/15">
              {badge}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}