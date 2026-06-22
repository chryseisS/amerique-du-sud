import { Link } from 'react-router-dom';
import { ChevronRight, Compass } from 'lucide-react';
import activites from '../donnees/activites.json';
import {
  PAYS,
  zonesDuPays,
  DRAPEAUX,
  IMAGES_PAYS,
  COULEURS_PAYS,
  versSlug,
} from '../donnees/constantes';

// Détecte si un drapeau est une URL d'image (PNG/JPG/SVG) ou un emoji
const estUneImage = (drapeau) =>
  typeof drapeau === 'string' && drapeau.startsWith('/');

function PlanificationAccueil() {
  return (
    <div className="pb-6">
      {/* ─── HERO AVEC FOND DE CARTE ─── */}
      <div className="relative overflow-hidden px-4 pt-8 pb-6">
        {/* Fond de carte (image décorative en arrière-plan) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/planification/planif.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Voile crème léger pour adoucir le bas et faire la transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-terra-50/10 to-terra-50" />

        {/* Contenu */}
        <div className="relative">
          <h1 className="text-4xl font-serif font-semibold text-terra-900 tracking-tight leading-tight">
            Planification
          </h1>
          <p className="text-sm text-terra-muted mt-0.5 max-w-sm italic">
            Planifie ton aventure à travers l'Amérique du Sud
          </p>
        </div>
      </div>

      {/* ─── LABEL ─── */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-terra-500 flex-shrink-0" strokeWidth={2} />
          <h2 className="text-xs font-medium text-terra-500 uppercase tracking-[0.15em] whitespace-nowrap">
            Choisis un pays
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-terra-500/40 to-transparent" />
        </div>
      </div>

      {/* ─── LISTE DES PAYS ─── */}
      <div className="px-4 space-y-3">
        {PAYS.map((pays) => {
          const zonesCount = zonesDuPays(activites, pays).length;
          const drapeau = DRAPEAUX[pays] || '🏳️';
          const image = IMAGES_PAYS[pays];
          const couleurs = COULEURS_PAYS[pays] || COULEURS_PAYS['Pérou'];

          return (
            <Link
              key={pays}
              to={`/planification/zones/${versSlug(pays)}`}
              className="group relative block h-28 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition active:scale-[0.99]"
              style={{ backgroundColor: couleurs.accent }}
            >
              {/* IMAGE DE FOND (optionnelle - se superpose si elle charge) */}
              {image && (
                <img
                  src={image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}

              {/* OVERLAY noir à gauche, transparent à droite (1er tiers) */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 30%, transparent 60%)',
                }}
              />

              {/* CONTENU */}
              <div className="relative h-full flex items-center px-5 gap-3">
                {/* GAUCHE : drapeau + nom + nb zones */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    {/* DRAPEAU : image PNG ou emoji selon la valeur */}
                    {estUneImage(drapeau) ? (
                      <img
                        src={drapeau}
                        alt={`Drapeau ${pays}`}
                        className="w-7 h-5 object-cover rounded-sm shadow-sm flex-shrink-0"
                      />
                    ) : (
                      <span className="text-2xl drop-shadow-sm leading-none">
                        {drapeau}
                      </span>
                    )}

                    <h3 className="font-serif font-semibold text-white text-lg leading-tight uppercase tracking-wider drop-shadow-sm">
                      {pays}
                    </h3>
                  </div>
                  <p className="text-xs text-white/90 ml-[38px] drop-shadow-sm">
                    {zonesCount} zone{zonesCount !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* DROITE : chevron */}
                <ChevronRight
                  className="w-6 h-6 text-white/90 group-hover:translate-x-1 transition-transform drop-shadow-sm"
                  strokeWidth={2}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default PlanificationAccueil;