import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, BookText } from 'lucide-react';
import { sectionParId } from '../donnees/enquetes';

export default function SectionEnquete() {
  const { sectionId } = useParams();
  const section = sectionParId(sectionId);

  // En-tête réutilisé
  const Entete = ({ titre, sousTitre }) => (
    <div className="relative px-5 pt-5 pb-1">
      <Link to="/jeux/enquetes" aria-label="Retour"
            className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
        <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
      </Link>
      <h1 className="font-serif text-[22px] leading-tight text-encre font-semibold text-center -mt-6 px-10">{titre}</h1>
      {sousTitre && <p className="text-center text-[12.5px] text-sepia mt-1">{sousTitre}</p>}
    </div>
  );

  if (!section) {
    return (
      <div className="fond-carte-enquete relative min-h-full overflow-hidden">
        <div className="vignette-carte" aria-hidden="true" />
        <Entete titre="Introuvable" />
        <div className="relative px-5 pt-10">
          <p className="text-center text-encre-douce text-sm">Cette enquête n'existe pas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fond-carte-enquete relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />
      <Entete titre={section.titre} sousTitre={section.sousTitre} />

      <div className="relative px-[18px] pt-4 pb-6">
        {section.type === 'explication' ? (
          // ─── Page descriptive ───
          <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
            {section.explication.map((p, i) => (
              <p key={i} className="text-[13.5px] text-justify leading-relaxed text-encre-douce first:mt-0 mt-3">{p}</p>
            ))}
            {section.note && (
              <div className="flex items-start gap-2 mt-5 pt-4 border-t border-parchemin-bordure">
                <BookText className="w-4 h-4 text-sepia shrink-0 mt-0.5" strokeWidth={1.9} />
                <p className="text-[12px] italic text-sepia leading-snug">{section.note}</p>
              </div>
            )}
          </div>
        ) : (
          // ─── Liste d'affaires ───
          <div className="flex flex-col gap-2.5">
            {section.cas.map((c, i) => (
              <Link key={c.id} to={`/jeux/enquetes/${section.id}/${c.id}`}
                    className="flex items-center gap-3 bg-parchemin-carte border border-parchemin-bordure rounded-xl p-3.5 shadow-[0_4px_12px_rgba(60,40,20,0.10)] transition-transform duration-200 hover:-translate-y-0.5">
                <span className="font-serif text-[18px] text-encre/35 font-semibold w-7 text-center shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="flex-1 min-w-0 font-serif text-[16px] leading-tight text-encre font-semibold">{c.titre}</h3>
                <ChevronRight className="shrink-0 w-5 h-5 text-encre/40" strokeWidth={2} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}