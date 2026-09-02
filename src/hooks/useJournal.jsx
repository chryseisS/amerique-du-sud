import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { preparerPhoto } from '../utils/compresserImage';

// ─── Helpers récapitulatif automatique ─────────────────────────────────────
// Convertit un objet Date en 'YYYY-MM-DD' local, même convention que
// aujourdHuiIso() dans EditeurEntree.jsx.
function versDateIso(date) {
  const d = new Date(date);
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

function ligneAnimal(o) {
  const lieuTxt = o.lieu ? ` (${o.lieu})` : '';
  const noteTxt = o.note ? ` : « ${o.note} »` : '';
  return `– ${o.animalNom}${lieuTxt}${noteTxt}`;
}

function lignePlat(a) {
  const avisTxt = a.avis ? ` : « ${a.avis} »` : '';
  return `– ${a.platNom}${avisTxt}`;
}

function ligneDefi(d) {
  const commTxt = d.commentaire ? ` : « ${d.commentaire} »` : '';
  return `– ${d.nom}${commTxt}`;
}

/**
 * Génère le récapitulatif automatique (animaux vus / plats goûtés /
 * expériences vécues) pour la période [dateDebut, dateFin]. Appelé à la
 * création ET à chaque modification de l'entrée (voir modifierEntree),
 * jamais recalculé "en direct" ailleurs (pas de useLiveQuery dessus).
 * Renvoie null si rien à afficher (pas de section vide).
 */
async function genererRecapAuto(dateDebut, dateFin) {
  const fin = dateFin || dateDebut;
  const dansPeriode = (date) => {
    const iso = versDateIso(date);
    return iso >= dateDebut && iso <= fin;
  };

  const [observations, avis, defis] = await Promise.all([
    db.observationsFaune.toArray(),
    db.avisGastronomie.toArray(),
    db.premieresFoisFaites.toArray(),
  ]);

  const animauxVus = observations.filter((o) => dansPeriode(o.date));
  const platsGoutes = avis.filter((a) => dansPeriode(a.date));
  const experiencesVecues = defis.filter((d) => dansPeriode(d.date));

  const sections = [];

  if (animauxVus.length) {
    sections.push(
      [
        `🐾 Animal${animauxVus.length > 1 ? 's vus' : ' vu'}`,
        ...animauxVus.map(ligneAnimal),
      ].join('\n')
    );
  }
  if (platsGoutes.length) {
    sections.push(
      [
        `🍽️ Plat${platsGoutes.length > 1 ? 's goûtés' : ' goûté'}`,
        ...platsGoutes.map(lignePlat),
      ].join('\n')
    );
  }
  if (experiencesVecues.length) {
    sections.push(
      [
        `✅ Expérience${experiencesVecues.length > 1 ? 's vécues' : ' vécue'}`,
        ...experiencesVecues.map(ligneDefi),
      ].join('\n')
    );
  }

  return sections.length ? sections.join('\n\n') : null;
}

// ═══════════════════════════════════════════════════════════════════════════
// useJournal — tout ce qu'il faut pour le journal de bord.
//
// Retourne :
//   entrees          — tableau de toutes les entrées (live, plus récentes d'abord)
//   creerEntree      — fonction(champs, fichiers[]) → id de la nouvelle entrée
//   modifierEntree   — fonction(id, champs) → met à jour le texte/dates/titre…
//   supprimerEntree  — fonction(id) → supprime l'entrée ET ses photos
//   ajouterPhotos    — fonction(entreeId, fichiers[], onProgres?) → compresse + stocke
//   supprimerPhoto   — fonction(photoId) → supprime mini + version pleine
//
// Les composants qui ont besoin des photos d'une entrée les interrogent
// directement (voir CarteEntreeJournal / DetailEntree) pour ne pas charger
// tous les blobs d'un coup.
// ═══════════════════════════════════════════════════════════════════════════
export function useJournal() {
  const entrees = useLiveQuery(
    () => db.journalEntrees.orderBy('dateDebut').reverse().toArray(),
    [],
    []
  );

  const creerEntree = async (champs, fichiers = [], onProgres) => {
    const recapAuto = await genererRecapAuto(champs.dateDebut, champs.dateFin);
    const id = await db.journalEntrees.add({
      titre: champs.titre?.trim() || 'Sans titre',
      dateDebut: champs.dateDebut,
      dateFin: champs.dateFin || null,
      lieu: champs.lieu?.trim() || '',
      texte: champs.texte || '',
      recapAuto,
      createdAt: new Date(),
    });
    if (fichiers.length) await ajouterPhotos(id, fichiers, onProgres);
    return id;
  };

  // Recalcule le récapitulatif à chaque modification (dates changées, ou
  // animal/plat/défi ajouté depuis pour la même période).
  const modifierEntree = async (id, champs) => {
    const recapAuto = await genererRecapAuto(champs.dateDebut, champs.dateFin);
    return db.journalEntrees.update(id, {
      titre: champs.titre?.trim() || 'Sans titre',
      dateDebut: champs.dateDebut,
      dateFin: champs.dateFin || null,
      lieu: champs.lieu?.trim() || '',
      texte: champs.texte || '',
      recapAuto,
    });
  };

  const supprimerEntree = async (id) => {
    const photos = await db.journalPhotos.where('entreeId').equals(id).primaryKeys();
    await db.journalPhotosPleines.bulkDelete(photos);
    await db.journalPhotos.bulkDelete(photos);
    await db.journalEntrees.delete(id);
  };

  /**
   * Compresse puis stocke une liste de fichiers pour une entrée.
   * @param {number} entreeId
   * @param {File[]} fichiers
   * @param {(fait:number, total:number)=>void} [onProgres]
   */
  const ajouterPhotos = async (entreeId, fichiers, onProgres) => {
    // Point de départ de l'ordre : après la dernière photo existante.
    const existantes = await db.journalPhotos
      .where('entreeId')
      .equals(entreeId)
      .primaryKeys();
    let ordre = existantes.length;

    let fait = 0;
    for (const fichier of fichiers) {
      const { plein, miniature, largeur, hauteur } = await preparerPhoto(fichier);
      const photoId = await db.journalPhotos.add({
        entreeId,
        miniature,
        largeur,
        hauteur,
        ordre: ordre++,
      });
      await db.journalPhotosPleines.add({ photoId, plein });
      fait += 1;
      onProgres?.(fait, fichiers.length);
    }
  };

  const supprimerPhoto = async (photoId) => {
    await db.journalPhotosPleines.delete(photoId);
    await db.journalPhotos.delete(photoId);
  };

  return {
    entrees,
    creerEntree,
    modifierEntree,
    supprimerEntree,
    ajouterPhotos,
    supprimerPhoto,
  };
}