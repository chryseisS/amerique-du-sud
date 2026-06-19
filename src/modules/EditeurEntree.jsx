import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ImagePlus, X, Check, Trash2 } from 'lucide-react';
import { db } from '../db';
import { useJournal } from '../hooks/useJournal';
import { useUrlBlob } from '../hooks/useUrlBlob';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function aujourdHuiIso() {
  const d = new Date();
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

// Vignette d'une photo DÉJÀ enregistrée (miniature depuis la DB)
function VignettePhotoExistante({ photo, onSupprimer }) {
  const url = useUrlBlob(photo.miniature);
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-terra-100">
      {url && <img src={url} alt="" className="w-full h-full object-cover" />}
      <button
        type="button"
        onClick={onSupprimer}
        className="absolute top-1 right-1 bg-black/55 text-white rounded-full p-1"
        aria-label="Retirer"
      >
        <X className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}

// Vignette d'un fichier sélectionné (pas encore enregistré)
function VignetteFichier({ fichier, onSupprimer }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    const u = URL.createObjectURL(fichier);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [fichier]);
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-terra-100 ring-2 ring-terra-500/40">
      {url && <img src={url} alt="" className="w-full h-full object-cover" />}
      <button
        type="button"
        onClick={onSupprimer}
        className="absolute top-1 right-1 bg-black/55 text-white rounded-full p-1"
        aria-label="Retirer"
      >
        <X className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EditeurEntree — sert à la fois à CRÉER (/nouveau) et MODIFIER (/:id/modifier)
// ═══════════════════════════════════════════════════════════════════════════
function EditeurEntree() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modeEdition = id !== undefined;
  const entreeId = modeEdition ? Number(id) : null;

  const { creerEntree, modifierEntree, ajouterPhotos, supprimerPhoto } = useJournal();

  // Données existantes (mode édition)
  const entree = useLiveQuery(
    () => (modeEdition ? db.journalEntrees.get(entreeId) : null),
    [entreeId]
  );
  const photosExistantes = useLiveQuery(
    () =>
      modeEdition
        ? db.journalPhotos.where('entreeId').equals(entreeId).sortBy('ordre')
        : [],
    [entreeId],
    []
  );

  // ─── État du formulaire ───────────────────────────────────────────────────
  const [titre, setTitre] = useState('');
  const [lieu, setLieu] = useState('');
  const [texte, setTexte] = useState('');
  const [plusieursJours, setPlusieursJours] = useState(false);
  const [dateDebut, setDateDebut] = useState(aujourdHuiIso());
  const [dateFin, setDateFin] = useState('');

  const [nouveauxFichiers, setNouveauxFichiers] = useState([]); // File[]
  const [aSupprimer, setASupprimer] = useState(new Set()); // ids photos existantes

  const [enregistrement, setEnregistrement] = useState(false);
  const [progres, setProgres] = useState(null); // { fait, total }
  const [erreur, setErreur] = useState('');

  // Pré-remplissage en édition (une seule fois, à l'arrivée des données)
  const initialise = useRef(false);
  useEffect(() => {
    if (modeEdition && entree && !initialise.current) {
      setTitre(entree.titre || '');
      setLieu(entree.lieu || '');
      setTexte(entree.texte || '');
      setDateDebut(entree.dateDebut || aujourdHuiIso());
      setPlusieursJours(Boolean(entree.dateFin));
      setDateFin(entree.dateFin || '');
      initialise.current = true;
    }
  }, [modeEdition, entree]);

  // ─── Sélection de photos ────────────────────────────────────────────────────
  const onChoisirFichiers = (e) => {
    const liste = Array.from(e.target.files || []);
    if (liste.length) setNouveauxFichiers((f) => [...f, ...liste]);
    e.target.value = ''; // permet de re-choisir le même fichier
  };

  const retirerFichier = (idx) =>
    setNouveauxFichiers((f) => f.filter((_, i) => i !== idx));

  const basculerSuppression = (photoId) =>
    setASupprimer((set) => {
      const copie = new Set(set);
      if (copie.has(photoId)) copie.delete(photoId);
      else copie.add(photoId);
      return copie;
    });

  // ─── Enregistrement ─────────────────────────────────────────────────────────
  const valide = titre.trim() && dateDebut;
  const dateFinInvalide = plusieursJours && dateFin && dateFin < dateDebut;

  const onEnregistrer = async () => {
    setErreur('');
    if (!valide) {
      setErreur('Un titre et une date de début sont nécessaires.');
      return;
    }
    if (dateFinInvalide) {
      setErreur('La date de fin doit être après la date de début.');
      return;
    }

    setEnregistrement(true);
    const champs = {
      titre,
      lieu,
      texte,
      dateDebut,
      dateFin: plusieursJours ? dateFin || null : null,
    };

    try {
      const onProgres = (fait, total) => setProgres({ fait, total });

      if (modeEdition) {
        await modifierEntree(entreeId, champs);
        // Suppressions différées
        for (const photoId of aSupprimer) await supprimerPhoto(photoId);
        // Ajouts
        if (nouveauxFichiers.length) {
          await ajouterPhotos(entreeId, nouveauxFichiers, onProgres);
        }
        navigate(`/journal/bord/${entreeId}`);
      } else {
        if (nouveauxFichiers.length) setProgres({ fait: 0, total: nouveauxFichiers.length });
        const nouvelId = await creerEntree(champs, nouveauxFichiers, onProgres);
        navigate(`/journal/bord/${nouvelId}`);
      }
    } catch (err) {
      console.error(err);
      setErreur("Une erreur est survenue pendant l'enregistrement.");
      setEnregistrement(false);
      setProgres(null);
    }
  };

  const photosVisibles = photosExistantes.filter((p) => !aSupprimer.has(p.id));

  return (
    <div className="p-4 pb-10">
      {/* Bouton retour */}
      <Link
        to={modeEdition ? `/journal/bord/${entreeId}` : '/journal/bord'}
        className="flex items-center gap-2 text-terra-500 mb-3"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">{modeEdition ? 'Annuler' : 'Retour'}</span>
      </Link>

      <h1 className="text-2xl font-serif text-terra-900 mb-4">
        {modeEdition ? "Modifier l'étape" : 'Nouvelle étape'}
      </h1>

      <div className="flex flex-col gap-4">
        {/* ─── Durée ─── */}
        <div>
          <label className="text-[11px] text-terra-muted block mb-1.5">Durée</label>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setPlusieursJours(false)}
              className={
                !plusieursJours
                  ? 'flex-1 px-3 py-2 rounded-xl text-sm bg-terra-500 text-white'
                  : 'flex-1 px-3 py-2 rounded-xl text-sm bg-terra-100 text-terra-muted border border-terra-border'
              }
            >
              Un seul jour
            </button>
            <button
              type="button"
              onClick={() => setPlusieursJours(true)}
              className={
                plusieursJours
                  ? 'flex-1 px-3 py-2 rounded-xl text-sm bg-terra-500 text-white'
                  : 'flex-1 px-3 py-2 rounded-xl text-sm bg-terra-100 text-terra-muted border border-terra-border'
              }
            >
              Plusieurs jours
            </button>
          </div>
        </div>

        {/* ─── Dates ─── */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[11px] text-terra-muted block mb-1">
              {plusieursJours ? 'Du' : 'Date'}
            </label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-full bg-white border border-terra-border rounded-lg px-3 py-2 text-sm text-terra-900 outline-none focus:border-terra-500 transition-colors"
            />
          </div>
          {plusieursJours && (
            <div className="flex-1">
              <label className="text-[11px] text-terra-muted block mb-1">Au</label>
              <input
                type="date"
                value={dateFin}
                min={dateDebut}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full bg-white border border-terra-border rounded-lg px-3 py-2 text-sm text-terra-900 outline-none focus:border-terra-500 transition-colors"
              />
            </div>
          )}
        </div>

        {/* ─── Titre ─── */}
        <div>
          <label className="text-[11px] text-terra-muted block mb-1">Titre</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Ex : Salar d'Uyuni au lever du soleil"
            className="w-full bg-white border border-terra-border rounded-lg px-3 py-2 text-sm text-terra-900 placeholder:text-terra-muted outline-none focus:border-terra-500 transition-colors"
          />
        </div>

        {/* ─── Lieu ─── */}
        <div>
          <label className="text-[11px] text-terra-muted block mb-1">
            Lieu <span className="text-terra-muted/60">(facultatif)</span>
          </label>
          <input
            type="text"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            placeholder="Ex : Uyuni, Bolivie"
            className="w-full bg-white border border-terra-border rounded-lg px-3 py-2 text-sm text-terra-900 placeholder:text-terra-muted outline-none focus:border-terra-500 transition-colors"
          />
        </div>

        {/* ─── Texte ─── */}
        <div>
          <label className="text-[11px] text-terra-muted block mb-1">Récit</label>
          <textarea
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            placeholder="Raconte ta journée…"
            rows={7}
            className="w-full bg-white border border-terra-border rounded-lg px-3 py-2 text-sm text-terra-900 placeholder:text-terra-muted outline-none focus:border-terra-500 transition-colors resize-y leading-relaxed"
          />
        </div>

        {/* ─── Photos ─── */}
        <div>
          <label className="text-[11px] text-terra-muted block mb-1.5">Photos</label>

          {(photosVisibles.length > 0 || nouveauxFichiers.length > 0) && (
            <div className="grid grid-cols-3 gap-2 mb-2.5">
              {photosVisibles.map((p) => (
                <VignettePhotoExistante
                  key={p.id}
                  photo={p}
                  onSupprimer={() => basculerSuppression(p.id)}
                />
              ))}
              {nouveauxFichiers.map((f, i) => (
                <VignetteFichier
                  key={i}
                  fichier={f}
                  onSupprimer={() => retirerFichier(i)}
                />
              ))}
            </div>
          )}

          <label className="flex items-center justify-center gap-2 w-full border border-dashed border-terra-border rounded-xl py-3 text-sm text-terra-500 cursor-pointer bg-terra-100/40">
            <ImagePlus className="w-4 h-4" strokeWidth={2} />
            Ajouter des photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onChoisirFichiers}
              className="hidden"
            />
          </label>
          <p className="text-[10px] text-terra-muted/70 mt-1.5">
            Les photos sont compressées et stockées sur ton téléphone, hors-ligne.
          </p>
        </div>

        {/* ─── Erreur ─── */}
        {erreur && <div className="text-xs text-red-500">{erreur}</div>}

        {/* ─── Enregistrer ─── */}
        <button
          onClick={onEnregistrer}
          disabled={enregistrement || !valide}
          className="w-full bg-terra-500 text-white rounded-xl py-3 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Check className="w-4 h-4" strokeWidth={2.5} />
          {enregistrement
            ? progres
              ? `Compression ${progres.fait}/${progres.total}…`
              : 'Enregistrement…'
            : modeEdition
              ? 'Enregistrer les modifications'
              : "Créer l'étape"}
        </button>
      </div>
    </div>
  );
}

export default EditeurEntree;
