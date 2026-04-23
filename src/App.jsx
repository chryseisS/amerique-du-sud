import { Routes, Route, Navigate } from 'react-router-dom';
import BarreOnglets from './composants/BarreOnglets.jsx';
import Planification from './modules/Planification.jsx';
import Apprendre from './modules/Apprendre.jsx';
import Jeux from './modules/Jeux.jsx';
import Journal from './modules/Journal.jsx';

function App() {
  return (
    <div className="min-h-screen flex justify-center bg-terra-muted/10">
      <div className="w-full max-w-[450px] min-h-screen flex flex-col bg-terra-50 shadow-xl">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/planification" replace />} />
            <Route path="/planification" element={<Planification />} />
            <Route path="/apprendre" element={<Apprendre />} />
            <Route path="/jeux" element={<Jeux />} />
            <Route path="/journal" element={<Journal />} />
          </Routes>
        </main>
        <BarreOnglets />
      </div>
    </div>
  );
}

export default App;