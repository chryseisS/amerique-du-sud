import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

/* Contenu à venir — même schéma que films.json le jour où tu veux le
   remplir (titre, année, type, pays, description) ; ou un schéma dédié
   si les livres ont besoin d'un champ auteur, etc. */

export default function Lecture() {
  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux/medias" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[24px] text-encre font-semibold text-center -mt-6">Lecture</h1>
      </div>

      <div className="relative px-[18px] pt-4 pb-6">
        <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)] flex flex-col items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-sepia" strokeWidth={1.8} />
          <p className="text-[13px] text-encre-douce leading-snug">
            Rien ici pour l'instant — cette section sera complétée bientôt.
          </p>
        </div>
      </div>
    </div>
  );
}