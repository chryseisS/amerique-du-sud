// src/modules/Apprendre.jsx
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import culture from '../donnees/culture.json';

function Apprendre() {
  return (
    <div className="px-4">

      {/* ─── Titre ─── */}
      <div className="relative h-28 overflow-hidden -mx-4 px-4 flex flex-col justify-between py-4">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/themes/header_apprendre.png')",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 95%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 95%, transparent 100%)',
          }}
        />
        
        {/* Voile crème léger pour adoucir le bas et faire la transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-terra-50/10 to-terra-50" />

        {/* Contenu */}
        <div className="relative">
          <h1 className="text-3xl font-serif font-semibold text-terra-900 tracking-tight leading-tight">
            Halte culturelle
          </h1>
          <p className="text-sm text-terra-muted mt-1 max-w-sm italic">
            Histoires et anecdotes
          </p>
        </div>
      </div>

      {/* ─── Se cultiver ─── */}
      <div className="text-[10px] uppercase tracking-wider text-terra-muted mb-4">
        Se cultiver
      </div>

      {/* ─── Catégories ─── */}
      <div className="flex flex-col gap-6">
        {culture.map((categorie) => (
          <div key={categorie.id}>

            {/* Titre de la catégorie */}
            <div className="flex items-baseline justify-between mb-2.5">
              <h2 className="font-serif text-lg text-terra-900">
                {categorie.titre}
              </h2>
              <span className="text-[10px] text-terra-muted">
                {categorie.themes.length} thème{categorie.themes.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Carousel de thèmes */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {categorie.themes.map((theme) => (
              <Link
                key={theme.id}
                to={`/apprendre/theme/${theme.id}`}
                className="flex-shrink-0 w-36 rounded-xl overflow-hidden min-h-[100px] relative"
                style={
                  theme.image
                    ? { backgroundImage: `url(${theme.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : {}
                }
              >
                {/* Dégradé sombre en bas pour lisibilité du texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Contenu par dessus l'image */}
                <div className="relative h-full p-3 flex flex-col justify-between min-h-[100px]">
                  <div className="text-[10px] text-white/70 leading-tight">
                    {theme.sousTitre}
                  </div>
                  <div className="font-serif text-sm text-white leading-tight">
                    {theme.titre}
                  </div>
                </div>
              </Link>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* ─── Sur place ─── */}
      <div className="text-[10px] uppercase tracking-wider text-terra-muted mt-8 mb-4">
        Sur place
      </div>

      {/* ─── Visites guidées ─── */}
      <Link
        to="/apprendre/visites-guidees"
        className="flex items-center gap-3 bg-white border-2 border-terra-500 rounded-xl px-3.5 py-3 mb-6"
      >
        <div className="w-8 h-8 rounded-full bg-terra-500/15 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-terra-500" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <div className="text-sm text-terra-900 font-medium">
            Visites guidées
          </div>
          <div className="text-[11px] text-terra-muted mt-0.5">
            Fiches terrain · lieux à connaître
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-terra-500" strokeWidth={2} />
      </Link>

    </div>
  );
}

export default Apprendre;