import { NavLink } from 'react-router-dom';

function BarreOnglets() {
  const onglets = [
    { chemin: '/planification', label: 'Planif\'',  image: '/images/onglets/planif.png' },
    { chemin: '/apprendre',     label: 'Culture', image: '/images/onglets/apprendre.png' },
    { chemin: '/jeux',          label: 'Jeux',    image: '/images/onglets/jeux.png' },
    { chemin: '/journal',       label: 'Journal', image: '/images/onglets/journal.png' },
  ];

  return (
    <nav className="bg-terra-100 border-t border-terra-border grid grid-cols-4 py-0.5 pb-2">
      {onglets.map(({ chemin, label, image }) => (
        <NavLink
          key={chemin}
          to={chemin}
          className="flex flex-col items-center gap-1 py-1.5"
        >
          {({ isActive }) => (
            <>
              <img
                src={image}
                className={`w-10 h-10 p-1 transition-all ${
                  isActive ? 'opacity-100' : 'opacity-50'
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? 'text-terra-500 font-bold' : 'text-terra-muted'
                }`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default BarreOnglets;