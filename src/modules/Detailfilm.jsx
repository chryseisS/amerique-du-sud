import { Link, useParams, Navigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Calendar, Clapperboard, Check, Eye } from 'lucide-react';
import { db } from '../db';
import films from '../donnees/films.json';
import { COULEURS_PAYS } from '../donnees/constantes';

export default function DetailFilm() {
  const { filmId } = useParams();
  const film = films.find((f) => f.id === filmId);

  const estRegarde = useLiveQuery(() => (film ? db.filmsRegardes.get(film.id) : undefined), [film?.id]);

  if (!film) return <Navigate to="/jeux/medias/films" replace />;

  const c = film.pays ? COULEURS_PAYS[film.pays] : null;

  async function toggleRegarde() {
    if (estRegarde) {
      await db.filmsRegardes.delete(film.id);
    } else {
      await db.filmsRegardes.put({ id: film.id, date: new Date().toISOString() });
    }
  }

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-2">
        <Link to="/jeux/medias/films" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
      </div>

      <div className="relative px-5 pb-6 flex flex-col gap-4">
        {/* Encart de présentation — titre / type / année / pays */}
        <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)] text-center">
          <p className="font-serif text-[22px] text-encre font-semibold leading-tight">{film.titre}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5">
            <span className="inline-flex items-center gap-1 text-[11.5px] text-encre-douce">
              <Clapperboard className="w-3.5 h-3.5" strokeWidth={2} />{film.type}
            </span>
            <span className="inline-flex items-center gap-1 text-[11.5px] text-encre-douce">
              <Calendar className="w-3.5 h-3.5" strokeWidth={2} />{film.annee}
            </span>
            {c && (
              <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
                    style={{ backgroundColor: c.iconBg, color: c.iconText }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.accent }} />
                {film.pays}
              </span>
            )}
          </div>
        </div>

        {/* Bouton "regardé" */}
        <div className="flex justify-center">
          <button onClick={toggleRegarde}
                  className={estRegarde
                    ? 'inline-flex items-center gap-2 bg-vert-cta text-creme font-semibold text-[13px] rounded-full px-5 py-2.5'
                    : 'inline-flex items-center gap-2 bg-parchemin-carte border border-parchemin-bordure text-encre-douce font-semibold text-[13px] rounded-full px-5 py-2.5'}>
            {estRegarde
              ? <><Check className="w-4 h-4" strokeWidth={2.5} />Regardé</>
              : <><Eye className="w-4 h-4" strokeWidth={2} />Marquer comme regardé</>}
          </button>
        </div>

        {/* Description */}
        <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
          <p className="text-[13.5px] text-encre-douce leading-relaxed text-justify">{film.description}</p>
        </div>
      </div>
    </div>
  );
}