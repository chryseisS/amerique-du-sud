import { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Reglages from './modules/Reglages.jsx';
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
import Medias from './modules/Medias.jsx';
import Films from './modules/Films.jsx';
import DetailFilm from './modules/DetailFilm.jsx';
import Lecture from './modules/Lecture.jsx';
import DetailLecture from './modules/DetailLecture.jsx';
import Playlists from './modules/Playlists.jsx';
import DetailPlaylist from './modules/DetailPlaylist.jsx';
import MiniJeux from './modules/MiniJeux.jsx';
import Taquin from './modules/Taquin.jsx';
import Tabou from './modules/Tabou.jsx';
import DuelVocabulaire from './modules/DuelVocabulaire.jsx';
import Timeline from './modules/Timeline.jsx';
import Wordle from './modules/Wordle.jsx';
import WordleRattrapage from './modules/WordleRattrapage.jsx';
import JeuxCartes from './modules/JeuxCartes.jsx';
import DetailJeuCarte from './modules/DetailJeuCarte.jsx';
import Surprises from './modules/Surprises.jsx';
import DetailSurprise from './modules/DetailSurprise.jsx';
import SurprisesWatcher from './composants/SurprisesWatcher.jsx';
import StockagePersistantSilencieux from './composants/StockagePersistantSilencieux.jsx';

// Autres
import Apprendre from './modules/Apprendre.jsx';
import Theme from './modules/Theme.jsx';
import Episode from './modules/Episode.jsx';
import VisitesGuidees from './modules/VisitesGuidees.jsx';
import DetailVisiteGuidee from './modules/DetailVisiteGuidee.jsx';
import Jeux from './modules/Jeux.jsx';

function App() {
  // <main> est le seul conteneur qui scrolle (voir plus bas). Comme il
  // ne se démonte jamais entre deux routes, son scrollTop n'est jamais
  // remis à 0 tout seul — d'où le bug : après avoir scrollé sur une
  // page puis navigué (y compris en revenant en arrière, ex. le geste
  // "retour" au doigt sur iOS), la page suivante apparaît au même
  // niveau de scroll que celui où on était, au lieu de son début.
  // On force donc un retour en haut à chaque changement de route.
  const mainRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);

    // Ferme le clavier / retire le focus d'un champ resté actif.
    document.activeElement?.blur?.();

    // Remet le zoom à 1 si l'utilisateur a zoomé au pincement. iOS n'a pas
    // d'API pour ça : on verrouille brièvement l'échelle via la balise
    // viewport, puis on la restaure aussitôt (le pincement reste possible).
    const vv = window.visualViewport;
    if (vv && vv.scale > 1.01) {
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        const original = meta.getAttribute('content');
        meta.setAttribute('content', 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover');
        setTimeout(() => meta.setAttribute('content', original), 150);
      }
    }
  }, [location.pathname]);

  return (
    <div className="h-dvh flex justify-center overflow-hidden bg-terra-muted/10">
      <div className="w-full max-w-[450px] h-dvh flex flex-col bg-terra-50 shadow-xl">
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/planification" replace />} />

            {/* Planification */}
            <Route path="/planification" element={<PlanificationAccueil />} />
            <Route path="/planification/zones/:paysSlug" element={<Zones />} />
            <Route path="/planification/zones/:paysSlug/:zoneSlug" element={<Zone />} />
            <Route path="/planification/activites/:slug" element={<DetailActivite />} />
            <Route path="/planification/pays/:id" element={<DetailPays />} />
            <Route path="/planification/lieux/:id" element={<DetailLieu />} />

            {/* Apprendre / Jeux (= "Divertissement" à l'écran) */}
            <Route path="/apprendre"                          element={<Apprendre />} />
            <Route path="/apprendre/theme/:themeId"           element={<Theme />} />
            <Route path="/apprendre/theme/:themeId/:episodeId"  element={<Episode />} />
            <Route path="/apprendre/visites-guidees"          element={<VisitesGuidees />} />
            <Route path="/apprendre/visites-guidees/:id"      element={<DetailVisiteGuidee />} />
            <Route path="/jeux"          element={<Jeux />} />
            <Route path="/jeux/quiz"     element={<Quiz />} />
            <Route path="/jeux/enquetes"                    element={<Enquetes />} />
            <Route path="/jeux/enquetes/:sectionId"         element={<SectionEnquete />} />
            <Route path="/jeux/enquetes/:sectionId/:casId"  element={<DetailCas />} />
            <Route path="/jeux/escapes"  element={<Escapes />} />
            <Route path="/jeux/escapes/:escapeId" element={<SectionEscape />} />
            <Route path="/jeux/medias" element={<Medias />} />
            <Route path="/jeux/medias/films" element={<Films />} />
            <Route path="/jeux/medias/films/:filmId" element={<DetailFilm />} />
            <Route path="/jeux/medias/lecture" element={<Lecture />} />
            <Route path="/jeux/medias/lecture/:livreId" element={<DetailLecture />} />
            <Route path="/jeux/medias/playlists" element={<Playlists />} />
            <Route path="/jeux/medias/playlists/:paysSlug" element={<DetailPlaylist />} />
            <Route path="/jeux/mini-jeux" element={<MiniJeux />} />
            <Route path="/jeux/mini-jeux/taquin" element={<Taquin />} />
            <Route path="/jeux/mini-jeux/tabou" element={<Tabou />} />
            <Route path="/jeux/mini-jeux/duel-vocabulaire" element={<DuelVocabulaire />} />
            <Route path="/jeux/mini-jeux/timeline" element={<Timeline />} />
            <Route path="/jeux/mini-jeux/wordle" element={<Wordle />} />
            <Route path="/jeux/mini-jeux/wordle/rattrapage" element={<WordleRattrapage />} />
            <Route path="/jeux/mini-jeux/wordle/jour/:index" element={<Wordle />} />
            <Route path="/jeux/mini-jeux/cartes" element={<JeuxCartes />} />
            <Route path="/jeux/mini-jeux/cartes/:jeuId" element={<DetailJeuCarte />} />
            <Route path="/jeux/surprises" element={<Surprises />} />
            <Route path="/jeux/surprises/:surpriseId" element={<DetailSurprise />} />


            {/* Journal */}
            <Route path="/journal"                  element={<Journal />} />
            <Route path="/journal/reglages"         element={<Reglages />} />
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
      <SurprisesWatcher />
      <StockagePersistantSilencieux />
    </div>
  );
}

export default App;