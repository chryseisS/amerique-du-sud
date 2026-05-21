import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

/**
 * Tout ce dont on a besoin pour les avis gastronomiques.
 *
 * Retourne :
 *   testeSet     — Set des noms de plats goûtés (lookup O(1))
 *   avisDe       — fonction(nomPlat) → avis | undefined
 *   ajouterAvis  — fonction({ platNom, avis }) → enregistre avis
 *   supprimerAvis — fonction(id) → supprime avis
 */
export function useAvisGastronomie() {
  const avis = useLiveQuery(
    () => db.avisGastronomie.orderBy('date').reverse().toArray(),
    [],
    []
  );

  const testeSet = new Set(avis.map((a) => a.platNom));

  const avisDe = (platNom) => avis.find((a) => a.platNom === platNom);

  const ajouterAvis = ({ platNom, avis: texte }) =>
    db.avisGastronomie.add({
      platNom,
      date: new Date(),
      avis: texte,
    });

  const supprimerAvis = (id) => db.avisGastronomie.delete(id);

  return { testeSet, avisDe, ajouterAvis, supprimerAvis };
}