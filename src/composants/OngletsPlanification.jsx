import { NavLink } from 'react-router-dom';

const ONGLETS = [
  { chemin: '/planification/activites', label: 'Activités' },
  { chemin: '/planification/lieux',     label: 'Lieux' },
  { chemin: '/planification/pays',      label: 'Pays' },
];

function OngletsPlanification() {
  return (
    <div className="sticky top-0 z-10 flex border-b border-terra-border mb-4 -mx-4 px-4 overflow-x-auto bg-terra-50">
      {ONGLETS.map(({ chemin, label }) => (
        <NavLink
          key={chemin}
          to={chemin}
          className="flex-shrink-0"
        >
          {({ isActive }) => (
            <div
              className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
                isActive
                  ? 'border-terra-500 text-terra-500 font-medium'
                  : 'border-transparent text-terra-muted'
              }`}
            >
              {label}
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
}

export default OngletsPlanification;