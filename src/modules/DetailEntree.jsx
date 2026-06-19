import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, MapPin, Calendar, Pencil, Trash2 } from 'lucide-react';
import { db } from '../db';
import { useJournal } from '../hooks/useJournal';
import { useUrlBlob } from '../hooks/useUrlBlob';
import { formaterPeriode, nbJours } from '../utils/dates';
import Lightbox from '../composants/Lightbox';

// Vignette de galerie (miniature depuis la DB)
function VignetteGalerie({ photo, onClick }) {
  const url = useUrlBlob(photo.miniature);
  return (
    <button
      type="button"
      onClick={onClick}
      className="aspect-square rounded-lg overflow-hidden bg-terra-100"
    >
      {url && (
        <img
          src={url}
          alt=""
          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
          loading="lazy"
        />
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DetailEntree — lecture d'une étape du journal.
// ═══════════════════════════════════════════════════════════════════════════
function DetailEntree() {
  const { id } = useParams();
  const entreeId = Number(id);
  const navigate = useNavigate();
  const { supprimerEntree } = useJournal();

  const entree = useLiveQuery(() => db.journalEntrees.get(entreeId), [entreeId]);
  const photos = useLiveQuery(
    () => db.journalPhotos.where('entreeId').equals(entreeId).sortBy('ordre'),
    [entreeId],
    []
  );

  const [lightbox, setLightbox] = useState(null); // index ou null
  const [confirmSuppr, setConfirmSuppr] = useState(false);

  if (entree === undefined) {
    return <div className="p-4 text-terra-muted text-sm">Chargement…</div>;
  }
  if (entree === null) {
    return (
      <div className="p-4">
        <Link to="/journal/bord" className="flex items-center gap-2 text-terra-500 mb-4">
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Retour</span>
        </Link>
        <p className="text-terra-muted">Cette étape n'existe plus.</p>
      </div>
    );
  }

  const jours = nbJours(entree.dateDebut, entree.dateFin);

  const onSupprimer = async () => {
    await supprimerEntree(entreeId);
    navigate('/journal/bord');
  };

  return (
    <div className="p-4 pb-10">
      {/* Bouton retour + actions */}
      <div className="flex items-center justify-between mb-3">
        <Link to="/journal/bord" className="flex items-center gap-2 text-terra-500">
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Retour</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/journal/bord/${entreeId}/modifier`)}
            className="p-2 text-terra-muted hover:text-terra-500 transition-colors"
            aria-label="Modifier"
          >
            <Pencil className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => setConfirmSuppr(true)}
            className="p-2 text-terra-muted hover:text-red-400 transition-colors"
            aria-label="Supprimer"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 text-xs text-terra-500 mb-1">
        <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
        <span className="uppercase tracking-wider">
          {formaterPeriode(entree.dateDebut, entree.dateFin)}
        </span>
        {jours > 1 && <span className="text-terra-muted">· {jours} jours</span>}
      </div>

      {/* Titre */}
      <h1 className="font-serif text-2xl text-terra-900 leading-tight">
        {entree.titre}
      </h1>

      {/* Lieu */}
      {entree.lieu && (
        <div className="flex items-center gap-1.5 text-sm text-terra-muted mt-1 mb-3">
          <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{entree.lieu}</span>
        </div>
      )}

      {/* Texte */}
      {entree.texte && (
        <p className="text-[15px] text-terra-900/85 leading-relaxed text-justify whitespace-pre-wrap mt-3 mb-4">
          {entree.texte}
        </p>
      )}

      {/* Galerie */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p, i) => (
            <VignetteGalerie key={p.id} photo={p} onClick={() => setLightbox(i)} />
          ))}
        </div>
      )}

      {/* Lightbox plein écran */}
      {lightbox !== null && (
        <Lightbox
          photos={photos}
          index={lightbox}
          onChangeIndex={setLightbox}
          onFermer={() => setLightbox(null)}
        />
      )}

      {/* Confirmation suppression */}
      {confirmSuppr && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6"
          onClick={() => setConfirmSuppr(false)}
        >
          <div
            className="bg-terra-50 rounded-2xl p-5 w-full max-w-[320px]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-serif text-lg text-terra-900 mb-1">
              Supprimer cette étape ?
            </p>
            <p className="text-sm text-terra-muted mb-4">
              Le texte et les photos seront définitivement effacés.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmSuppr(false)}
                className="flex-1 bg-white border border-terra-border text-terra-muted rounded-xl py-2.5 text-sm"
              >
                Annuler
              </button>
              <button
                onClick={onSupprimer}
                className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailEntree;
