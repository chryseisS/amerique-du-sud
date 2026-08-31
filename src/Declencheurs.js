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
   ════════════════════════════════════════════════════════════════════ */

export async function declencherEvenement(type, valeur) {
  const cle = `${type}:${valeur}`;
  await db.evenements.put({ cle, date: new Date().toISOString() });
}