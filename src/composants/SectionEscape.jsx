import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookText } from 'lucide-react';
import escapes from '../donnees/escapes.json';

export default function SectionEscape() {
  const { escapeId } = useParams();

  // Chercher l'escape dans les deux sections
  const escape = 
    escapes.homeMade.find(e => e.id === escapeId) ||
    escapes.communaute.find(e => e.id === escapeId);

  // En-tête réutilisé
  const Entete = ({ titre, sousTitre }) => (
    <div className="relative px-5 pt-5 pb-1">
      <Link to="/jeux/escapes" state={{ onglet: 'dl' }} aria-label="Retour"
            className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
        <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
      </Link>
      <h1 className="font-serif text-[22px] leading-tight text-encre font-semibold text-center -mt-6 px-10">{titre}</h1>
      {sousTitre && <p className="text-center text-[12.5px] text-sepia mt-1">{sousTitre}</p>}
    </div>
  );

  if (!escape) {
    return (
      <div className="fond-carte-escape relative min-h-full overflow-hidden">
        <div className="vignette-carte" aria-hidden="true" />
        <Entete titre="Introuvable" />
        <div className="relative px-5 pt-10">
          <p className="text-center text-encre-douce text-sm">Cet escape n'existe pas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fond-carte-escape relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />
      <Entete titre={escape.titre} sousTitre={escape.sousTitre} />

      <div className="relative px-[18px] pt-4 pb-6">


        {/* Contenu */}
        <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
          {escape.explication && escape.explication.map((p, i) => (
            <p key={i} className="text-[13.5px] text-justify leading-relaxed text-encre-douce first:mt-0 mt-3">{p}</p>
          ))}
          {escape.note && (
            <div className="flex items-start gap-2 mt-5 pt-4 border-t border-parchemin-bordure">
              <BookText className="w-4 h-4 text-sepia shrink-0 mt-0.5" strokeWidth={1.9} />
              <p className="text-[12px] italic text-sepia leading-snug">{escape.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}