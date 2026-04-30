import { Star } from 'lucide-react';

function Etoiles({ nombre, total = 5 }) {
  if (!nombre) return null;

  const etoiles = Array.from({ length: total }, (_, i) => i);

  return (
    <div className="flex gap-0.5">
      {etoiles.map((i) => (
        <Star
          key={i}
          className={
            i < nombre
              ? 'w-3.5 h-3.5 fill-terra-500 text-terra-500'
              : 'w-3.5 h-3.5 text-terra-500/25'
          }
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default Etoiles;