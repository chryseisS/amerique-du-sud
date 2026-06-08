import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { sectionParId, casParId } from '../donnees/enquetes';

export default function DetailCas() {
  const { sectionId, casId } = useParams();
  const section = sectionParId(sectionId);
  const cas = casParId(section, casId);

  if (!section || !cas) {
    return (
      <div className="fond-carte-enquete relative min-h-full overflow-hidden">
        <div className="vignette-carte" aria-hidden="true" />
        <div className="relative px-5 pt-5">
          <Link to={`/jeux/enquetes/${sectionId}`} className="inline-flex items-center gap-2 text-encre-douce text-sm">
            <ArrowLeft className="w-4 h-4" strokeWidth={2} /> Retour
          </Link>
          <p className="text-center text-encre-douce text-sm mt-10">Affaire introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fond-carte-enquete relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to={`/jeux/enquetes/${section.id}`} aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <div className="text-center -mt-6 px-10">
          <div className="text-[10px] uppercase tracking-[0.18em] text-sepia font-semibold">{section.titre}</div>
          <h1 className="font-serif text-[22px] leading-tight text-encre font-semibold mt-1">{cas.titre}</h1>
        </div>
      </div>

      {/* Histoire + question */}
      <div className="relative px-[18px] pt-4 pb-8">
        <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
          {cas.histoire.map((p, i) => (
            <p key={i} className="text-[14px] text-justify leading-relaxed text-encre first:mt-0 mt-3.5">{p}</p>
          ))}
        </div>

        {/* La question — sans réponse */}
        <div className="mt-7 text-center px-4">
        <div className="mx-auto w-14 h-px bg-parchemin-bordure" />
        <p className="font-serif italic text-[26px] text-encre font-semibold mt-5 leading-tight">
            {cas.question}
        </p>
        <div className="mx-auto w-14 h-px bg-parchemin-bordure mt-5" />
        </div>
      </div>
    </div>
  );
}