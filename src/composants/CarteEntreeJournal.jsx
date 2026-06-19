import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { MapPin, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { db } from '../db';
import { useUrlBlob } from '../hooks/useUrlBlob';
import { formaterPeriode } from '../utils/dates';

// ═══════════════════════════════════════════════════════════════════════════
// CarteEntreeJournal — ligne COMPACTE de la timeline.
// Vignette à gauche, date + titre (+ lieu) à droite.
// Ne charge qu'une miniature de couverture (1 blob) + le nombre de photos.
// ═══════════════════════════════════════════════════════════════════════════
function CarteEntreeJournal({ entree }) {
  // Couverture = première photo (plus petit id pour cette entrée). 1 seul blob.
  const couverture = useLiveQuery(
    () => db.journalPhotos.where('entreeId').equals(entree.id).first(),
    [entree.id],
    undefined
  );
  const nbPhotos = useLiveQuery(
    () => db.journalPhotos.where('entreeId').equals(entree.id).count(),
    [entree.id],
    0
  );

  const url = useUrlBlob(couverture?.miniature);

  return (
    <Link
      to={`/journal/bord/${entree.id}`}
      className="flex items-center gap-3 bg-terra-100 rounded-xl p-2 pr-3 border border-terra-border shadow-sm active:bg-terra-200/60 transition-colors"
    >
      {/* Vignette */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-terra-200 flex-shrink-0">
        {url ? (
          <img
            src={url}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-terra-muted/50">
            <ImageIcon className="w-5 h-5" strokeWidth={1.7} />
          </div>
        )}
        {nbPhotos > 1 && (
          <span className="absolute bottom-0.5 right-0.5 text-[9px] leading-none text-white bg-black/55 px-1 py-0.5 rounded">
            {nbPhotos}
          </span>
        )}
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-terra-500">
          {formaterPeriode(entree.dateDebut, entree.dateFin)}
        </div>
        <h3 className="font-serif text-base text-terra-900 leading-tight truncate">
          {entree.titre}
        </h3>
        {entree.lieu && (
          <div className="flex items-center gap-1 text-[11px] text-terra-muted">
            <MapPin className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
            <span className="truncate">{entree.lieu}</span>
          </div>
        )}
      </div>

      <ChevronRight
        className="w-4 h-4 text-terra-muted/60 flex-shrink-0"
        strokeWidth={2}
      />
    </Link>
  );
}

export default CarteEntreeJournal;