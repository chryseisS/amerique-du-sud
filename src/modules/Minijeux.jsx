import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Puzzle, Ban } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « JEUX »  — route /jeux/mini-jeux
   ──────────────────────────────────────────────────────────────────
   • Fichier conservé sous MiniJeux.jsx (pour éviter la collision avec
     Jeux.jsx, le hub principal désormais titré "Divertissement") mais
     affiché comme "Jeux" dans l'app.
   • Un seul jeu pour l'instant (Taquin). Ajoute une entrée ici quand
     tu codes le prochain (mots croisés, memory, pendu…).
   ════════════════════════════════════════════════════════════════════ */

const JEUX = [
  {
    id: 'taquin', titre: 'Taquin', to: '/jeux/mini-jeux/taquin', Icone: Puzzle,
    desc: 'Reconstitue l’image en faisant glisser les pièces.',
  },
  {
    id: 'tabou', titre: 'Tabou', to: '/jeux/mini-jeux/tabou', Icone: Ban,
    desc: 'Fais deviner un mot sans utiliser les mots interdits.',
  },
];

export default function MiniJeux() {
  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[24px] text-encre font-semibold text-center -mt-6">Jeux</h1>
        <p className="text-center text-[12.5px] text-sepia mt-0.5">Des jeux courts pour patienter</p>
      </div>

      {/* Liste des jeux */}
      <div className="relative px-[18px] pt-4 pb-6 flex flex-col gap-3">
        {JEUX.map(({ id, titre, desc, to, Icone }) => (
          <Link key={id} to={to}
                className="flex gap-3.5 items-center bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-4 shadow-[0_4px_12px_rgba(60,40,20,0.12)] transition-transform duration-200 hover:-translate-y-0.5">
            <div className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-[#5a4a36]/10 border border-parchemin-bordure">
              <Icone className="w-5 h-5 text-sepia" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-[16px] leading-tight text-encre font-semibold m-0">{titre}</h3>
              <p className="text-[11.5px] text-encre-douce mt-1 leading-snug">{desc}</p>
            </div>
            <ChevronRight className="self-center shrink-0 w-5 h-5 text-encre/40" strokeWidth={2} />
          </Link>
        ))}
      </div>
    </div>
  );
}