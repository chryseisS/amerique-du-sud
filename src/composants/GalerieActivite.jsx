import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';


function GalerieActivite({ images }) {
  if (!images || images.length === 0) return null;

  const url = (fichier) => `/images/activites/${fichier}`;

  // ─── Carrousel inline (embla) ───
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [indexInline, setIndexInline] = useState(0);

  // Synchronise indexInline avec le carrousel embla
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(0, true);
    setIndexInline(0);
    const onSelect = () => setIndexInline(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  const [lightboxOuvert, setLightboxOuvert] = useState(false);
  const [indexLightbox, setIndexLightbox] = useState(0);

  const ouvrirLightbox = useCallback((index) => {
    setIndexLightbox(index);
    setLightboxOuvert(true);
  }, []);

  // Slides au format attendu par yet-another-react-lightbox
  const slides = images.map((fichier) => ({ src: url(fichier) }));

  // ─── Barres pour le carrousel INLINE (position: absolute par rapport au conteneur) ───
  const BarresInline = () => {
    if (images.length <= 1) return null;
    return (
      <div className="absolute top-2 left-2 right-2 z-50 flex gap-1 pointer-events-none">
        {images.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${
              i <= indexInline ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    );
  };

  // ─── Barres pour la LIGHTBOX (position: fixed par rapport au viewport) ───
  // Style inline pour garantir l'affichage indépendamment du contexte de la lightbox
  const BarresLightbox = () => {
    if (images.length <= 1) return null;
    return (
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          right: 12,
          display: 'flex',
          gap: 4,
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {images.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 9999,
              backgroundColor:
                i <= indexLightbox ? '#ffffff' : 'rgba(255,255,255,0.3)',
              transition: 'background-color 300ms',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* ─── Carrousel inline ─── */}
      <div className="relative mb-4 rounded-xl overflow-hidden">
        <BarresInline />

        {/* Viewport embla */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((fichier, i) => (
              <div
                key={fichier}
                className="flex-[0_0_100%] min-w-0 aspect-[4/3] bg-terra-100"
              >
                <img
                  src={url(fichier)}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  onClick={() => ouvrirLightbox(i)}
                  className="w-full h-full object-cover cursor-zoom-in"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Lightbox plein écran ─── */}
      <Lightbox
        open={lightboxOuvert}
        close={() => setLightboxOuvert(false)}
        slides={slides}
        index={indexLightbox}
        on={{
          view: ({ index }) => setIndexLightbox(index),
        }}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: false,
        }}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        render={{
          // Barres en haut du viewport, par-dessus tout
          controls: () => <BarresLightbox />,
        }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
      />
    </>
  );
}

export default GalerieActivite;