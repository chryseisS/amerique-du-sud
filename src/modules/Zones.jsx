import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import activites from '../donnees/activites.json';
import pays from '../donnees/pays.json';
import {
  zonesDuPays,
  paysDuSlug,
  DRAPEAUX,
  IMAGES_PAYS_HEADER,
  COULEURS_PAYS,
} from '../donnees/constantes';
import CarteZone from '../composants/CarteZone';

// Détecte si la valeur est une URL d'image ou un emoji
const estUneImage = (v) => typeof v === 'string' && v.startsWith('/');

function Zones() {
  const { paysSlug } = useParams();
  const navigate = useNavigate();

  const paysAffiche = paysDuSlug(paysSlug) || 'Pérou';
  const zones = zonesDuPays(activites, paysAffiche);

  const paysInfo = pays.find((p) => p.nom === paysAffiche);
  const apercuPays = paysInfo?.description?.split('\n\n')[0] ?? '';

  const drapeau = DRAPEAUX[paysAffiche];
  const imageFond = IMAGES_PAYS_HEADER[paysAffiche];
  const couleurs = COULEURS_PAYS[paysAffiche] || COULEURS_PAYS['Pérou'];

  return (
    <div>
      {/* ─── HEADER : image en arrière-plan plein cadre ─── */}
      <div
        className="relative h-20 overflow-hidden"
        style={{ backgroundColor: couleurs.accent }}
      >
        {imageFond && (
          <img
            src={imageFond}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.15) 80%, transparent 100%)',
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 h-1 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, var(--color-terra-50) 100%)',
          }}
        />

        <div className="relative h-full px-4 flex items-center gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="flex-shrink-0 -ml-1 p-1 text-white/90 hover:text-white transition"
            aria-label="Retour"
          >
            <ChevronLeft className="w-6 h-6 drop-shadow-md" strokeWidth={2.5} />
          </button>

          {drapeau && (
            estUneImage(drapeau) ? (
              <img
                src={drapeau}
                alt={`Drapeau ${paysAffiche}`}
                className="w-8 h-5 object-cover rounded-sm shadow-md flex-shrink-0"
              />
            ) : (
              <span className="text-2xl leading-none drop-shadow-lg flex-shrink-0">
                {drapeau}
              </span>
            )
          )}

          <h1 className="text-xl font-serif font-semibold text-white tracking-wide uppercase drop-shadow-md leading-none truncate">
            {paysAffiche}
          </h1>
        </div>
      </div>

      {/* ─── CONTENU SOUS LE HEADER ─── */}
      <div className="p-4">

        {/* ─── À SAVOIR SUR LE PAYS — Carte mise en avant ─── */}
        {paysInfo && apercuPays && (
          <Link
            to={`/planification/pays/${paysInfo.id}`}
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
                <BookOpen className="w-5 h-5" strokeWidth={2} />
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-0.5"
                  style={{ color: couleurs.iconText }}
                >
                  Guide pratique
                </div>
                <h2 className="font-serif font-semibold text-terra-900 leading-tight text-base">
                  À savoir sur : {paysAffiche}
                </h2>
                <p className="text-xs text-terra-muted/90 mt-1 line-clamp-1">
                  Trajet · Frontières · Sécurité · Monnaie
                </p>
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
            Zones à visiter
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-terra-border to-transparent" />
          <span className="text-xs text-terra-muted">
            {zones.length}
          </span>
        </div>

        {/* ─── LISTE DES ZONES ─── */}
        <div>
          {zones.map((z) => (
            <CarteZone key={z.slug} zone={z} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Zones;