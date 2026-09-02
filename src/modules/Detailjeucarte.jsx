import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Users, Layers } from 'lucide-react';
import CARTES_JEUX from '../donnees/cartes.json';

export default function DetailJeuCarte() {
  const { jeuId } = useParams();
  const jeu = CARTES_JEUX.find((j) => j.id === jeuId);

  if (!jeu) return <Navigate to="/jeux/mini-jeux/cartes" replace />;

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-2">
        <Link to="/jeux/mini-jeux/cartes" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
      </div>

      <div className="relative px-5 pb-8 flex flex-col gap-3.5">
        <div className="text-center mb-1">
          <h1 className="font-serif text-[26px] text-encre font-semibold leading-tight">{jeu.titre}</h1>
          {jeu.origine && <p className="text-[12px] text-sepia mt-1">{jeu.origine}</p>}
        </div>

        {(jeu.joueurs || jeu.materiel) && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] text-encre-douce mb-1">
            {jeu.joueurs && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />{jeu.joueurs}
              </span>
            )}
            {jeu.materiel && (
              <span className="inline-flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />{jeu.materiel}
              </span>
            )}
          </div>
        )}

        <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
          <div className="text-[10px] uppercase tracking-wider text-sepia font-semibold mb-1.5">Objectif</div>
          <p className="text-[13.5px] text-encre leading-relaxed">{jeu.objectif}</p>
        </div>

        {jeu.sections?.map((s, i) => (
          <div key={i}
               className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
            <div className="text-[10px] uppercase tracking-wider text-sepia font-semibold mb-1.5">{s.titre}</div>
            <p className="text-[13.5px] text-encre-douce leading-relaxed whitespace-pre-line text-justify">{s.contenu}</p>
          </div>
        ))}

        {jeu.note && (
          <p className="text-[12px] italic text-sepia leading-snug px-1 mt-1">{jeu.note}</p>
        )}
      </div>
    </div>
  );
}