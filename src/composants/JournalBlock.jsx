import { Link } from 'react-router-dom';

/**
 * Bloc réutilisable pour le Journal
 * @param {string} to - Lien de destination
 * @param {string|React.ReactNode} icon - Chemin image (/images/...) ou composant Lucide
 * @param {string} bgClassName - Classe Tailwind/CSS pour le fond (avec image si besoin)
 * @param {React.ReactNode} children - Contenu du bloc
 * @param {string} minHeight - Hauteur minimale (défaut: "min-h-[140px]")
 */
function JournalBlock({ to, icon, bgClassName, children, minHeight = 'min-h-[140]' }) {
  const isImageIcon = typeof icon === 'string';
  const IconComponent = !isImageIcon ? icon : null;

  return (
    <Link
      to={to}
      className={`${bgClassName} rounded-2xl px-5 py-4 ${minHeight} flex items-center gap-5 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group`}
    >
      {/* Icône grosse — calée à gauche */}
      <div className="flex items-center justify-center flex-shrink-0">
        {isImageIcon ? (
          <img
            src={icon}
            alt="icon"
            className="w-24 h-24 object-contain drop-shadow-md group-hover:scale-110 transition-transform"
          />
        ) : (
          <IconComponent className="w-20 h-20" strokeWidth={1.7} />
        )}
      </div>

      {/* Contenu — juste à droite de l'icône, centré verticalement */}
      <div className="flex flex-col justify-center">
        {children}
      </div>
    </Link>
  );
}

export default JournalBlock;