import { Routes, Route, Navigate } from 'react-router-dom';
import BarreOnglets from './composants/BarreOnglets.jsx';

// Planification
import Activites from './modules/Activites.jsx';
import Lieux from './modules/Lieux.jsx';
import Pays from './modules/Pays.jsx';
import DetailActivite from './modules/DetailActivite.jsx';
import DetailLieu from './modules/DetailLieu.jsx';
import DetailPays from './modules/DetailPays.jsx';

// Journal
import Journal from './modules/Journal.jsx';
import Gastronomie from './modules/Gastronomie.jsx';
import PremieresFois from './modules/PremieresFois.jsx';
import Faune from './modules/Faune.jsx';
import DetailFaune from './modules/DetailFaune.jsx';

// Autres
// En haut, avec les autres imports :
import Apprendre from './modules/Apprendre.jsx';
import Theme from './modules/Theme.jsx';
import Episode from './modules/Episode.jsx';
import VisitesGuidees from './modules/VisitesGuidees.jsx';
import DetailVisiteGuidee from './modules/DetailVisiteGuidee.jsx';
import Jeux from './modules/Jeux.jsx';

function App() {
  return (
    <div className="min-h-screen flex justify-center bg-terra-muted/10">
      <div className="w-full max-w-[450px] min-h-screen flex flex-col bg-terra-50 shadow-xl">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/planification" replace />} />

            {/* Planification : 3 sous-vues + redirection par défaut */}
            <Route path="/planification"                  element={<Navigate to="/planification/activites" replace />} />
            <Route path="/planification/activites"        element={<Activites />} />
            <Route path="/planification/activites/:slug"  element={<DetailActivite />} />
            <Route path="/planification/lieux"            element={<Lieux />} />
            <Route path="/planification/lieux/:id"        element={<DetailLieu />} />
            <Route path="/planification/pays"             element={<Pays />} />
            <Route path="/planification/pays/:id"         element={<DetailPays />} />

            {/* Apprendre / Jeux */}
            <Route path="/apprendre"                          element={<Apprendre />} />
            <Route path="/apprendre/theme/:themeId"           element={<Theme />} />
            <Route path="/apprendre/theme/:themeId/:episodeId"  element={<Episode />} />
            <Route path="/apprendre/visites-guidees"          element={<VisitesGuidees />} />
            <Route path="/apprendre/visites-guidees/:id"      element={<DetailVisiteGuidee />} />
            <Route path="/jeux"      element={<Jeux />} />

            {/* Journal */}
            <Route path="/journal"                  element={<Journal />} />
            <Route path="/journal/gastronomie"      element={<Gastronomie />} />
            <Route path="/journal/premieres-fois"   element={<PremieresFois />} />
            <Route path="/journal/faune"            element={<Faune />} />
            <Route path="/journal/faune/:slug"      element={<DetailFaune />} />
          </Routes>
        </main>
        <BarreOnglets />
      </div>
    </div>
  );
}

export default App;