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