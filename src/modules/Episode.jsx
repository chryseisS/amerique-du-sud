// src/modules/Episode.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import Accordeon from '../composants/Accordeon';

function Episode() {
  const { themeId, episodeId } = useParams();
  const navigate = useNavigate();

  // ─── ÉTATS ───────────────────────────────────────
  const [episode, setEpisode] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);
  const [lu, setLu] = useState(false);

  // ─── CLÉ LOCALSTORAGE ────────────────────────────
  // Chaque épisode a une clé unique : "lu_incas_avant-eux"
  const cleStorage = `lu_${themeId}_${episodeId}`;

  // ─── CHARGEMENT DU JSON + STATUT LU ──────────────
  useEffect(() => {
    setChargement(true);
    setErreur(false);

    const dejaLu = localStorage.getItem(cleStorage) === 'true';
    setLu(dejaLu);

    const modules = import.meta.glob('../donnees/themes/*.json');
    const chemin = `../donnees/themes/${themeId}.json`;

    if (modules[chemin]) {
      modules[chemin]()
        .then((module) => {
          const theme = module.default;
          const episodeTrouve = theme.episodes.find(
            (e) => e.id === episodeId
          );
          if (episodeTrouve) {
            setEpisode(episodeTrouve);
          } else {
            setErreur(true);
          }
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

  }, [themeId, episodeId, cleStorage]);

  // ─── MARQUER COMME LU ────────────────────────────
  const marquerLu = () => {
    localStorage.setItem(cleStorage, 'true');
    setLu(true);
  };

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

  if (erreur || !episode) {
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
          Épisode introuvable.
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

      {/* Numéro d'épisode */}
      <div className="text-[10px] uppercase tracking-wider text-terra-muted mb-1">
        Épisode {episode.numero}
      </div>

      {/* Titre */}
      <h1 className="font-serif text-3xl text-terra-900 leading-tight mb-1">
        {episode.titre}
      </h1>

      {/* Sous-titre */}
      <div className="text-[11px] uppercase tracking-wider text-terra-muted mb-4">
        {episode.sousTitre}
      </div>

      {/* Description — toujours visible */}
      <p className="text-sm text-terra-900 leading-relaxed mb-6 text-justify">
        {episode.description}
      </p>

      {/* Accordéons — sections détaillées */}
      {episode.sections && episode.sections.length > 0 && (
        <div className="border-t border-terra-border mb-8 text-justify">
          {episode.sections.map((section, i) => (
            <Accordeon
              key={i}
              titre={section.titre}
              contenu={section.contenu}
            />
          ))}
        </div>
      )}

      {/* Bouton lu / déjà lu */}
      {!lu ? (
        <button
          onClick={marquerLu}
          className="w-full bg-terra-500 text-white rounded-xl py-3 font-medium text-sm flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" strokeWidth={2.5} />
          J'ai lu cet épisode
        </button>
      ) : (
        <div className="w-full bg-terra-100 border border-terra-500/30 rounded-xl py-3 flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-terra-500" strokeWidth={2.5} />
          <span className="text-sm text-terra-500 font-medium">Lu</span>
        </div>
      )}

    </div>
  );
}

export default Episode;