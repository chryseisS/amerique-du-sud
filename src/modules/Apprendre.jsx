// src/modules/Apprendre.jsx
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import culture from '../donnees/culture.json';

function Apprendre() {
  return (
    <div className="p-4">

      {/* ─── Titre ─── */}
      <h1 className="text-3xl font-serif text-terra-900 mb-4">
        Apprendre
      </h1>

      {/* ─── Visites guidées ─── */}
      <Link
        to="/apprendre/visites-guidees"
        className="flex items-center justify-between bg-terra-500 rounded-2xl p-4 mb-6 shadow-[0_4px_16px_rgba(201,98,63,0.22)]"
      >
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/60 mb-1">
            Sur place
          </div>
          <div className="font-serif italic text-lg text-white leading-tight">
            Visites guidées
          </div>
          <div className="text-[11px] text-white/70 mt-1">
            Fiches terrain · lieux à connaître
          </div>
        </div>
        <MapPin className="w-8 h-8 text-white/30" strokeWidth={1.5} />
      </Link>

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

    </div>
  );
}

export default Apprendre;