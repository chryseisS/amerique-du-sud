import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

/* ════════════════════════════════════════════════════════════════════
   ÉPISODES LUS — remplace l'ancien stockage localStorage
   ──────────────────────────────────────────────────────────────────
   Table Dexie à ajouter dans db.js si absente :
     episodesLus: 'id, date'
   id = "${themeId}_${episodeId}" — même format que l'ancienne clé
   localStorage (moins le préfixe "lu_"), donc la migration ne fait
   que copier telle quelle (voir migrationEpisodesLus.js).
   ════════════════════════════════════════════════════════════════════ */

export function useEpisodesLus() {
  const lusDB = useLiveQuery(() => db.episodesLus.toArray(), []) ?? [];
  const luSet = useMemo(() => new Set(lusDB.map((e) => e.id)), [lusDB]);

  function estLu(themeId, episodeId) {
    return luSet.has(`${themeId}_${episodeId}`);
  }

  async function marquerLu(themeId, episodeId) {
    try {
      await db.episodesLus.put({ id: `${themeId}_${episodeId}`, date: new Date().toISOString() });
    } catch (err) {
      console.error("Erreur en marquant l'épisode lu :", err);
    }
  }

  return { luSet, estLu, marquerLu };
}