import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

/**
 * Tout ce dont on a besoin pour les observations de faune.
 *
 * Retourne :
 *   observations     — tableau de toutes les observations (live)
 *   vuSet            — Set des noms d'animaux observés (pour lookup O(1))
 *   observationDe    — fonction(nomAnimal) → observation | undefined
 *   marquerVu        — fonction({ animalNom, lieu, note }) → Promise
 *   supprimerObservation — fonction(id) → Promise
 */
export function useObservationsFaune() {
  // useLiveQuery re-rend automatiquement le composant quand la DB change
  const observations = useLiveQuery(
    () => db.observationsFaune.orderBy('date').reverse().toArray(),
    [],
    [] // valeur par défaut pendant le chargement initial
  );

  const vuSet = new Set(observations.map((o) => o.animalNom));

  const observationDe = (animalNom) =>
    observations.find((o) => o.animalNom === animalNom);

  const marquerVu = ({ animalNom, lieu = '', note = '' }) =>
    db.observationsFaune.add({
      animalNom,
      date: new Date(),
      lieu,
      note,
    });

  const supprimerObservation = (id) =>
    db.observationsFaune.delete(id);

  return { observations, vuSet, observationDe, marquerVu, supprimerObservation };
}