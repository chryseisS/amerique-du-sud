import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Map } from 'lucide-react';
import activites from '../donnees/activites.json';
import lieux from '../donnees/lieux.json';
import { versSlug, estIncontournable, COULEURS_PAYS } from '../donnees/constantes';
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

  // Couleurs du pays — pour aligner l'encadré sur le « Guide pratique » du pays
  const pays = liste[0]?.pays;
  const couleurs = COULEURS_PAYS[pays] || COULEURS_PAYS['Pérou'];

  return (
    <div className="p-4">
      {/* ─── TITRE AVEC FLÈCHE RETOUR INTÉGRÉE ─── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 active:opacity-70 transition cursor-pointer" onClick={() => navigate(-1)}>
            {/* Flèche de retour stylisée avec la couleur du pays */}
            <ArrowLeft 
              className="w-6 h-6 flex-shrink-0" 
              style={{ color: couleurs.accent }} 
              strokeWidth={2.5} 
            />
            
            <h1 
              className="font-serif text-3xl font-semibold text-terra-900 leading-tight tracking-wide"
              style={{ color: couleurs.accent }}
            >
              {nomZone}
            </h1>
          </div>
          
          {/* Petite ligne d'accentuation décalée pour s'aligner sous le texte */}
          <div 
            className="h-[2px] w-8 mt-3.5 ml-9 rounded-full" 
            style={{ backgroundColor: couleurs.accent }}
          />
        </div>
      </div>

      {/* ─── GUIDE DE VISITE — même format que « Guide pratique » du pays ─── */}

      {/* ─── GUIDE DE VISITE — même format que « Guide pratique » du pays ─── */}
      {apercu && (
        <Link
          to={`/planification/lieux/${lieu.id}`}
          className="group block mb-6 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition active:scale-[0.99] relative"
          style={{ backgroundColor: couleurs.iconBg }}
        >
          {/* Bordure verticale accent (gauche) */}
          <div
            className="absolute left-0 top-0 h-full w-1.5"
            style={{ backgroundColor: couleurs.accent }}
          />

          <div className="relative py-3 pl-5 flex items-center gap-3.5">
            {/* Icône ronde avec couleur du pays */}
            <div
              className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: couleurs.accent, color: 'white' }}
            >
              <Map className="w-5 h-5" strokeWidth={2} />
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-0.5"
                style={{ color: couleurs.iconText }}
              >
                {nomZone}
              </div>
              <h2 className="font-serif font-semibold text-terra-900 leading-tight text-base">
                Guide de visite
              </h2>
            </div>

            {/* Chevron coloré */}
            <ChevronRight
              className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform"
              style={{ color: couleurs.accent }}
              strokeWidth={2.5}
            />
          </div>
        </Link>
      )}

      {/* ─── SÉPARATEUR / TITRE DE SECTION ─── */}
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-xs font-semibold text-terra-500 uppercase tracking-[0.15em] whitespace-nowrap">
          À explorer
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-terra-border to-transparent" />
        <span className="text-xs text-terra-muted">{liste.length}</span>
      </div>

      {/* ─── LISTE DES ACTIVITÉS ─── */}
      {liste.map((act) => (
        <CarteActivite key={act.nom} activite={act} />
      ))}
    </div>
  );
}

export default Zone;
