import { useEffect, useState } from 'react';

/* ════════════════════════════════════════════════════════════════════
   BarreProgression — barre qui se remplit de 0 à `pct` (%) au montage.
   • className              : classes de la piste (hauteur, fond, arrondi, marges)
   • remplissageClassName   : classes du remplissage (couleur, arrondi)
   Si `pct` change plus tard (données qui arrivent, nouvel élément coché),
   la largeur glisse simplement vers la nouvelle valeur.
   ════════════════════════════════════════════════════════════════════ */
export default function BarreProgression({
  pct,
  className = '',
  remplissageClassName = '',
  delai = 150,
  duree = 1000,
}) {
  const [monte, setMonte] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMonte(true), delai);
    return () => clearTimeout(id);
  }, [delai]);

  const reduit =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`h-full ${remplissageClassName}`}
        style={{
          width: `${monte ? pct : 0}%`,
          transition: reduit ? 'none' : `width ${duree}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
    </div>
  );
}