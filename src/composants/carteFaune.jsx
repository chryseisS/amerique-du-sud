import { Link } from 'react-router-dom';
import { versSlug } from '../donnees/constantes';

function CarteFaune({ animal, vu }) {
  const numero = String(animal.numero).padStart(3, '0');
  const etoiles = '★'.repeat(animal.rarete) + '☆'.repeat(3 - animal.rarete);

  return (
    <Link
      to={`/journal/faune/${versSlug(animal.nom)}`}
      className={`relative bg-terra-100 rounded-xl p-2.5 text-center border overflow-hidden ${
        vu
          ? 'border-terra-border'
          : 'border-terra-border border-dashed opacity-55'
      }`}
    >
      {/* Numéro Pokédex */}
      <div className="text-[9px] text-terra-muted text-left mb-0.5">
        N°{numero}
      </div>

      {/* Zone image */}
      <div className="w-14 h-14 mx-auto mb-1.5 flex items-center justify-center">
        {animal.photo ? (
          <img
            src={`/images/faune/${animal.photo}`}
            alt={animal.nom}
            className={`w-full h-full object-contain transition-all duration-500 ${
              vu ? '' : 'grayscale brightness-0'
            }`}
          />
        ) : (
          /* Fallback emoji si pas de photo */
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl ${
              vu ? 'bg-terra-500/10' : 'bg-terra-muted/10 grayscale brightness-50'
            }`}
          >
            {animal.emoji}
          </div>
        )}
      </div>

      {/* Nom */}
      <div
        className={`text-[11px] font-medium leading-tight ${
          vu ? 'text-terra-900' : 'text-terra-muted'
        }`}
      >
        {animal.nom}
      </div>

      {/* Étoiles */}
      <div
        className={`text-[8px] mt-0.5 ${
          vu ? 'text-terra-500' : 'text-terra-muted'
        }`}
      >
        {etoiles}
      </div>
    </Link>
  );
}

export default CarteFaune;