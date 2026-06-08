import { NavLink } from 'react-router-dom';
import { Map, BookOpen, Dices, PenLine } from 'lucide-react';

function BarreOnglets() {
  const onglets = [
    { chemin: '/planification', label: 'Planif',    Icone: Map },
    { chemin: '/apprendre',     label: 'Apprendre', Icone: BookOpen },
    { chemin: '/jeux',          label: 'Jeux',      Icone: Dices },
    { chemin: '/journal',       label: 'Journal',   Icone: PenLine },
  ];

  return (
    <nav className="bg-terra-100 border-t border-terra-border grid grid-cols-4 py-1.5 pb-3">
      {onglets.map(({ chemin, label, Icone }) => (
        <NavLink
          key={chemin}
          to={chemin}
          className="flex flex-col items-center gap-1 py-1.5"
        >
          {({ isActive }) => (
            <>
              <Icone
                className={`w-5 h-5 ${isActive ? 'text-terra-500' : 'text-terra-muted'}`}
                strokeWidth={1.7}
              />
              <span
                className={`text-xs ${
                  isActive ? 'text-terra-500 font-semibold' : 'text-terra-muted'
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