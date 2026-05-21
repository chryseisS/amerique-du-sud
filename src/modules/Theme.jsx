// src/modules/Theme.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

function Theme() {
  const { themeId } = useParams();
  const navigate = useNavigate();

  // ─── ÉTATS ───────────────────────────────────────
  const [theme, setTheme] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);

  // ─── CHARGEMENT DU FICHIER JSON ──────────────────
  useEffect(() => {
    setChargement(true);
    setErreur(false);

    const modules = import.meta.glob('../donnees/themes/*.json');
    const chemin = `../donnees/themes/${themeId}.json`;

    if (modules[chemin]) {
      modules[chemin]()
        .then((module) => {
          setTheme(module.default);
          setChargement(false);
        })
        .catch(() => {
          setErreur(true);
          setChargement(false);
        });
    } else {
      setErreur(true);
      setChargement(false);
    }
  }, [themeId]);

  // ─── ÉTATS D'AFFICHAGE ───────────────────────────
  if (chargement) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-terra-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Retour</span>
        </button>
        <div className="text-terra-muted text-sm">Chargement…</div>
      </div>
    );
  }

  if (erreur || !theme) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-terra-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Retour</span>
        </button>
        <div className="text-terra-muted text-sm">
          Ce thème n'est pas encore disponible.
        </div>
      </div>
    );
  }

  // ─── RENDU ───────────────────────────────────────
  return (
    <div className="p-4">

      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-terra-500 mb-4"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </button>

      {/* En-tête */}
      <h1 className="font-serif text-3xl text-terra-900 leading-tight mb-1">
        {theme.titre}
      </h1>
      <div className="text-[11px] uppercase tracking-wider text-terra-muted mb-6">
        {theme.sousTitre}
      </div>

      {/* Compteur */}
      <div className="text-xs text-terra-muted mb-3">
        {theme.episodes.length} épisode{theme.episodes.length > 1 ? 's' : ''}
      </div>

      {/* Liste des épisodes */}
      <div className="flex flex-col gap-2.5">
        {theme.episodes.map((episode) => {
          const estLu = localStorage.getItem(
            `lu_${themeId}_${episode.id}`
          ) === 'true';

          return (
            <Link
              key={episode.id}
              to={`/apprendre/theme/${themeId}/${episode.id}`}
              className={`
                bg-terra-100 rounded-xl px-3 py-3
                flex items-center gap-3
                shadow-[0_2px_8px_rgba(74,47,26,0.08),0_1px_2px_rgba(74,47,26,0.06)]
                hover:shadow-[0_4px_12px_rgba(74,47,26,0.12),0_2px_4px_rgba(74,47,26,0.08)]
                active:shadow-[0_1px_3px_rgba(74,47,26,0.1)]
                transition-shadow
                ${estLu
                  ? 'border-l-[3px] border-l-terra-500 border-y border-r border-terra-border'
                  : 'border border-terra-border'
                }
              `}
            >
              {/* Pastille ronde avec numéro */}
              <div
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0
                  ${estLu
                    ? 'bg-gradient-to-br from-terra-500 to-terra-700 shadow-[0_2px_6px_rgba(201,98,63,0.35)]'
                    : 'bg-white border-2 border-terra-border'
                  }
                `}
              >
                <span
                  className={`
                    font-serif text-base
                    ${estLu ? 'text-white' : 'text-terra-muted'}
                  `}
                >
                  {episode.numero}
                </span>
              </div>

              {/* Titre + sous-titre */}
              <div className="flex-1 min-w-0">
                <div className="font-serif text-[15px] text-terra-900 leading-tight font-semibold">
                  {episode.titre}
                </div>
                <div className="text-[10px] text-terra-muted mt-0.5 leading-tight font-semibold">
                  {episode.sousTitre}
                </div>
              </div>

              {/* Chevron */}
              <ChevronRight
                className="w-3.5 h-3.5 text-terra-500 flex-shrink-0"
                strokeWidth={2}
              />
            </Link>
          );
        })}
      </div>

    </div>
  );
}

export default Theme;