import { Routes, Route, Navigate } from 'react-router-dom';
import BarreOnglets from './composants/BarreOnglets.jsx';

// Planification
// import Activites from './modules/Activites.jsx';
import Lieux from './modules/Lieux.jsx';
import Pays from './modules/Pays.jsx';
import Zone from './modules/Zone.jsx';
import Zones from './modules/Zones.jsx';
import DetailActivite from './modules/DetailActivite.jsx';
import DetailLieu from './modules/DetailLieu.jsx';
import DetailPays from './modules/DetailPays.jsx';
import PlanificationAccueil from './modules/PlanificationAccueil.jsx';

// Journal
import Journal from './modules/Journal.jsx';
import JournalBord from './modules/JournalBord.jsx';
import EditeurEntree from './modules/EditeurEntree.jsx';
import DetailEntree from './modules/DetailEntree.jsx';
import Gastronomie from './modules/Gastronomie.jsx';
import PremieresFois from './modules/PremieresFois.jsx';
import Faune from './modules/Faune.jsx';
import DetailFaune from './modules/DetailFaune.jsx';
//Jeux
import Quiz from './modules/Quiz.jsx';
import Enquetes from './modules/Enquetes.jsx';
import SectionEnquete from './modules/SectionEnquete.jsx';
import DetailCas from './modules/DetailCas.jsx';
import Escapes from './modules/Escapes.jsx';
import SectionEscape from './composants/SectionEscape';

// Autres
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

            {/* Planification */}
            <Route path="/planification" element={<PlanificationAccueil />} />
            <Route path="/planification/zones/:paysSlug" element={<Zones />} />
            <Route path="/planification/zones/:paysSlug/:zoneSlug" element={<Zone />} />
            <Route path="/planification/activites/:slug" element={<DetailActivite />} />
            <Route path="/planification/pays/:id" element={<DetailPays />} />
            <Route path="/planification/lieux/:id" element={<DetailLieu />} />

            {/* Apprendre / Jeux */}
            <Route path="/apprendre"                          element={<Apprendre />} />
            <Route path="/apprendre/theme/:themeId"           element={<Theme />} />
            <Route path="/apprendre/theme/:themeId/:episodeId"  element={<Episode />} />
            <Route path="/apprendre/visites-guidees"          element={<VisitesGuidees />} />
            <Route path="/apprendre/visites-guidees/:id"      element={<DetailVisiteGuidee />} />
            <Route path="/jeux"      element={<Jeux />} />
            <Route path="/jeux"          element={<Jeux />} />
            <Route path="/jeux/quiz"     element={<Quiz />} />
            <Route path="/jeux/enquetes"                    element={<Enquetes />} />
            <Route path="/jeux/enquetes/:sectionId"         element={<SectionEnquete />} />
            <Route path="/jeux/enquetes/:sectionId/:casId"  element={<DetailCas />} />
            <Route path="/jeux/escapes"  element={<Escapes />} />
            <Route path="/jeux/escapes/:escapeId" element={<SectionEscape />} />


            {/* Journal */}
            <Route path="/journal"                  element={<Journal />} />
            <Route path="/journal/bord"             element={<JournalBord />} />
            <Route path="/journal/bord/nouveau"     element={<EditeurEntree />} />
            <Route path="/journal/bord/:id"         element={<DetailEntree />} />
            <Route path="/journal/bord/:id/modifier" element={<EditeurEntree />} />
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