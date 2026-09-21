import { db } from './db';

/* ════════════════════════════════════════════════════════════════════
   DÉCLENCHEURS — journal d'événements générique
   ──────────────────────────────────────────────────────────────────
   Le principe : n'importe quel module peut "annoncer" qu'un événement
   a eu lieu (un animal découvert, une frontière passée, un défi
   réussi…) sans rien savoir des Surprises. Le module Surprises se
   contente d'écouter ce journal et de réagir quand une de ses
   conditions de déblocage est remplie.

   Table Dexie à ajouter dans db.js si absente :
     evenements: 'cle, date'

   Utilisation depuis n'importe quel composant :
     import { declencherEvenement } from '../declencheurs';
     await declencherEvenement('animal', 'flamant-rose');
     await declencherEvenement('frontiere', 'perou-bolivie');
     await declencherEvenement('defi', 'chasse-au-cuy');

   Types actuellement utilisés par les Surprises : 'animal', 'frontiere',
   'defi'. Le type 'date' ne passe pas par ce journal : il est comparé
   directement à la date du jour (voir SurprisesWatcher.jsx).

   Un défi qui a besoin de PLUSIEURS événements 'defi' à la fois (ex. un
   défi par capitale) n'a rien de spécial côté déclenchement : on
   appelle `declencherEvenement('defi', id)` séparément pour chaque
   défi accompli, au fur et à mesure. C'est le déclencheur de la
   surprise elle-même, dans surprises.json, qui exige la combinaison
   (declencheur.type: 'defis', valeur: [id1, id2, ...] — voir
   SurprisesWatcher.jsx).
   ════════════════════════════════════════════════════════════════════ */

export async function declencherEvenement(type, valeur) {
  const cle = `${type}:${valeur}`;
  await db.evenements.put({ cle, date: new Date().toISOString() });
}