import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import activites from '../donnees/activites.json';
import lieux from '../donnees/lieux.json';
import { versSlug, estIncontournable } from '../donnees/constantes';
import CarteActivite from '../composants/CarteActivite';

function Zone() {
  const { zoneSlug } = useParams();
  const navigate = useNavigate();

  const liste = activites
    .filter((a) => versSlug(a.lieu) === zoneSlug)
    .sort((a, b) => (estIncontournable(b) ? 1 : 0) - (estIncontournable(a) ? 1 : 0));

  const lieu = lieux.find((l) => versSlug(l.nom) === zoneSlug);
  const nomZone = lieu?.nom ?? liste[0]?.lieu ?? 'Zone';
  const apercu = lieu?.description?.trim()
    ? lieu.description.split('\n\n')[0].replace(/\[\[([^\]]+)\]\]/g, '$1')
    : '';

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-terra-500 mb-4">
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </button>

      <h1 className="font-serif text-3xl text-terra-900 mb-4">{nomZone}</h1>

      {/* TRAJET DANS LA ZONE — uniquement si description non vide dans lieux.json */}
      {apercu && (
        <Link
          to={`/planification/lieux/${lieu.id}`}
          className="mb-4 p-4 rounded-xl bg-white border border-terra-border/60 shadow-sm relative overflow-hidden flex items-start gap-2 hover:border-terra-500/40 transition"
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-terra-500" />
          <div className="pl-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span>🧭</span>
              <h2 className="font-serif font-semibold text-terra-900">Le trajet dans {nomZone}</h2>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-terra-muted flex-shrink-0 self-center" strokeWidth={2} />
        </Link>
      )}

      {liste.map((act) => (
        <CarteActivite key={act.nom} activite={act} />
      ))}
    </div>
  );
}

export default Zone;