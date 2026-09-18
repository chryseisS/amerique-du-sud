import { Link } from 'react-router-dom';
import { cheminImage } from '../utils/cheminImage';


/* ════════════════════════════════════════════════════════════════════
   ÉCRAN PRINCIPAL « DIVERTISSEMENT »  (fichier conservé sous Jeux.jsx /
   route /jeux pour ne pas casser BarreOnglets.jsx — seul le titre
   affiché change)
   ──────────────────────────────────────────────────────────────────
   • Quiz / Énigmes / Jeux = univers interactifs (Escapes est maintenant
     regroupé à l'intérieur d'Énigmes plutôt que d'être une carte à part).
   • Médias = Films / Lecture (et plus tard Musique / Podcast) — a
     remplacé l'ancien module générique Divertissement.
   ════════════════════════════════════════════════════════════════════ */

const CARTES = [
  {
    id: 'quiz', titre: 'Quiz', to: '/jeux/quiz', icone: '/images/jeux/icones/quiz.svg', couleur: 'bg-jeu-quiz',
    desc: 'Teste tes connaissances.',
  },
  {
    id: 'enigmes', titre: 'Énigmes', to: '/jeux/enquetes', icone: '/images/jeux/icones/enquetes.svg', couleur: 'bg-jeu-enquete',
    desc: 'Enquêtes et escapes à résoudre.',
  },
  {
    id: 'jeux', titre: 'Jeux', to: '/jeux/mini-jeux', icone: '/images/jeux/icones/jeux.svg', couleur: 'bg-jeu-minijeux',
    desc: 'Des petits jeux pour se détendre... ou pas.',
  },
  {
    id: 'medias', titre: 'Médias', to: '/jeux/medias', icone: '/images/jeux/icones/medias.svg', couleur: 'bg-jeu-diverti',
    desc: 'Films et lectures pour prolonger le voyage.',
  },
  {
    id: 'surprises', titre: 'Surprises', to: '/jeux/surprises', icone: '/images/jeux/icones/surprises.svg', couleur: 'bg-jeu-surprise',
    desc: 'Des surprises à débloquer en cours de route.',
  },
];



export default function Jeux() {
  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />


      {/* En-tête */}
      <div className="relative px-6 pt-6 pb-4">
        <div className="text-[11px] tracking-[0.2em] font-semibold text-sepia mt-4">AIRE DE JEU</div>
        <h1 className="font-serif text-[46px] leading-none text-encre font-semibold mt-0.5">Divertissement</h1>
        <p className="text-encre-douce text-[13.5px] leading-relaxed max-w-[215px] mt-2.5">
          Explore, résous et échappe-toi à travers l’Amérique du Sud.
        </p>
      </div>

      {/* Cartes */}
      <div className="relative px-5 pt-1 pb-6 flex flex-col gap-3.5">
        {CARTES.map(({ id, titre, desc, icone, couleur, to }) => (
          <Link key={id} to={to}
                  className={`relative text-left rounded-[20px] p-[17px] border border-creme/15 ${couleur} texture-cuir shadow-[0_8px_22px_rgba(40,20,8,0.28)] transition-transform duration-200 hover:-translate-y-0.5`}>
            <div className="flex items-start gap-3.5">
              <div className="shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center bg-creme/10 border border-creme/30">
                <img src={cheminImage(icone)} alt="" className="w-6 h-6" />
              </div>
              <div className="pr-14">
                <div className="font-serif text-2xl text-creme leading-none font-semibold">{titre}</div>
                <p className="text-[12.5px] leading-snug text-creme/70 mt-1.5">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}