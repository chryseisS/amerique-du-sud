import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { preparerPhoto } from '../utils/compresserImage';

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
    const id = await db.journalEntrees.add({
      titre: champs.titre?.trim() || 'Sans titre',
      dateDebut: champs.dateDebut,
      dateFin: champs.dateFin || null,
      lieu: champs.lieu?.trim() || '',
      texte: champs.texte || '',
      createdAt: new Date(),
    });
    if (fichiers.length) await ajouterPhotos(id, fichiers, onProgres);
    return id;
  };

  const modifierEntree = (id, champs) =>
    db.journalEntrees.update(id, {
      titre: champs.titre?.trim() || 'Sans titre',
      dateDebut: champs.dateDebut,
      dateFin: champs.dateFin || null,
      lieu: champs.lieu?.trim() || '',
      texte: champs.texte || '',
    });

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
