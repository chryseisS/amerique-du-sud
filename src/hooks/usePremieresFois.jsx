import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

/**
 * usePremieresFois
 *
 * Même pattern que useObservationsFaune / useAvisGastronomie.
 * ⚠️ Je n'ai pas eu accès à useObservationsFaune.js / useAvisGastronomie.js,
 * donc j'ai déduit la convention (useLiveQuery + Set + fonctions async) de
 * leur usage dans Faune.jsx / DetailFaune.jsx / Gastronomie.jsx. Le chemin
 * d'import de `db` ci-dessous suppose que db.js est à la racine de src/ ;
 * adapte-le si besoin (ex: '../donnees/db').
 */
export function usePremieresFois() {
  const enregistrements = useLiveQuery(() => db.premieresFoisFaites.toArray(), []) ?? [];

  // Set des noms de défis marqués comme faits
  const faitSet = new Set(enregistrements.map((e) => e.nom));

  // Le commentaire (+ date) enregistré pour un défi donné, ou undefined
  const commentaireDe = (nom) => enregistrements.find((e) => e.nom === nom);

  // Marque un défi comme fait, avec un commentaire facultatif
  const marquerFait = async ({ nom, commentaire }) => {
    await db.premieresFoisFaites.add({
      nom,
      commentaire: commentaire || '',
      date: new Date(),
    });
  };

  // Supprime l'enregistrement (repasse le défi en "pas fait")
  const supprimerFait = async (id) => {
    await db.premieresFoisFaites.delete(id);
  };

  return { faitSet, commentaireDe, marquerFait, supprimerFait };
}