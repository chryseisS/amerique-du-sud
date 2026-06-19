import Dexie from 'dexie';


export const db = new Dexie('MonVoyage');

db.version(1).stores({
  /**
   * observationsFaune
   *   animalNom  : nom de l'animal (clé étrangère vers faune.json)
   *   date       : Date JS de l'observation
   *   lieu       : string libre (ex: "Vallée Sacrée, Cuzco")
   *   note       : string libre, facultatif
   */
  observationsFaune: '++id, animalNom, date',
  avisGastronomie: '++id, platNom, date',
});

// ─── Version 2 : Journal de bord ───────────────────────────────────────────
// Les tables de la v1 sont conservées automatiquement ; on déclare ici
// uniquement les nouvelles.
//
// On sépare volontairement les photos en deux tables :
//   journalPhotos        → miniature (~600px) + métadonnées. LÉGER.
//   journalPhotosPleines → version pleine (~1600px). LOURD, chargé à la demande.
//
// Ainsi la timeline n'a jamais à charger les gros blobs : elle ne lit que la
// miniature de couverture de chaque entrée.
db.version(2).stores({
  /**
   * journalEntrees
   *   titre      : string
   *   dateDebut  : string ISO 'YYYY-MM-DD' (tri lexicographique = tri réel)
   *   dateFin    : string ISO 'YYYY-MM-DD' ou null (séjour d'un seul jour)
   *   lieu       : string libre, facultatif
   *   texte      : string libre
   *   createdAt  : Date JS
   */
  journalEntrees: '++id, dateDebut',

  /**
   * journalPhotos (miniatures)
   *   entreeId   : id de l'entrée parente
   *   miniature  : Blob JPEG ~600px
   *   largeur    : largeur de la version pleine (pour le ratio d'affichage)
   *   hauteur    : hauteur de la version pleine
   *   ordre      : entier, ordre d'affichage
   */
  journalPhotos: '++id, entreeId',

  /**
   * journalPhotosPleines (versions pleines)
   *   photoId    : = id du record journalPhotos correspondant (clé primaire)
   *   plein      : Blob JPEG ~1600px
   */
  journalPhotosPleines: 'photoId',
});