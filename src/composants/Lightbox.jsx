import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../db';
import { useUrlBlob } from '../hooks/useUrlBlob';

// ═══════════════════════════════════════════════════════════════════════════
// Lightbox — visionneuse plein écran.
// Charge la version PLEINE de la photo courante à la demande (jamais toutes).
// ═══════════════════════════════════════════════════════════════════════════
function Lightbox({ photos, index, onChangeIndex, onFermer }) {
  const courante = photos[index];
  const [pleinBlob, setPleinBlob] = useState(null);
  const url = useUrlBlob(pleinBlob);

  // Charge le blob plein de la photo courante
  useEffect(() => {
    let actif = true;
    setPleinBlob(null);
    if (courante) {
      db.journalPhotosPleines.get(courante.id).then((p) => {
        if (actif) setPleinBlob(p?.plein || courante.miniature || null);
      });
    }
    return () => {
      actif = false;
    };
  }, [courante]);

  const précédent = () => onChangeIndex((index - 1 + photos.length) % photos.length);
  const suivant = () => onChangeIndex((index + 1) % photos.length);

  // Clavier
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onFermer();
      if (e.key === 'ArrowLeft') précédent();
      if (e.key === 'ArrowRight') suivant();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Swipe tactile
  const debutX = useRef(null);
  const onTouchStart = (e) => {
    debutX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (debutX.current === null) return;
    const delta = e.changedTouches[0].clientX - debutX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) précédent();
      else suivant();
    }
    debutX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
      onClick={onFermer}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Fermer */}
      <button
        onClick={onFermer}
        className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-1"
        aria-label="Fermer"
      >
        <X className="w-7 h-7" strokeWidth={2} />
      </button>

      {/* Compteur */}
      {photos.length > 1 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {index + 1} / {photos.length}
        </div>
      )}

      {/* Image */}
      {url ? (
        <img
          src={url}
          alt=""
          className="max-h-[88vh] max-w-[94vw] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="text-white/50 text-sm">Chargement…</div>
      )}

      {/* Flèches */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              précédent();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-8 h-8" strokeWidth={2} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              suivant();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
            aria-label="Suivant"
          >
            <ChevronRight className="w-8 h-8" strokeWidth={2} />
          </button>
        </>
      )}
    </div>
  );
}

export default Lightbox;
