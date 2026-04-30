import { Link } from 'react-router-dom';
import { versSlug } from '../donnees/constantes';

function CarteFaune({ animal, vu }) {
  // Numéro formaté façon Pokédex : 001, 002…
  const numero = String(animal.numero).padStart(3, '0');

  // Étoiles de rareté en texte
  const etoiles = '★'.repeat(animal.rarete) + '☆'.repeat(3 - animal.rarete);

  return (
    <Link
      to={`/journal/faune/${versSlug(animal.nom)}`}
      className={`bg-terra-100 rounded-xl p-2.5 text-center border ${
        vu
          ? 'border-terra-border'
          : 'border-terra-border border-dashed opacity-55'
      }`}
    >
      {/* Numéro Pokédex aligné à gauche */}
      <div className="text-[9px] text-terra-muted text-left mb-0.5">
        N°{numero}
      </div>

      {/* Bulle ronde avec emoji — grise et désaturée si pas vu */}
      <div
        className={`w-14 h-14 mx-auto mb-1.5 rounded-full flex items-center justify-center text-3xl ${
          vu ? 'bg-terra-500/10' : 'bg-terra-muted/10 grayscale brightness-50'
        }`}
      >
        {animal.emoji}
      </div>

      {/* Nom — terra-900 si vu, terra-muted si pas vu */}
      <div
        className={`text-[11px] font-medium ${
          vu ? 'text-terra-900' : 'text-terra-muted'
        }`}
      >
        {animal.nom}
      </div>

      {/* Étoiles de rareté */}
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