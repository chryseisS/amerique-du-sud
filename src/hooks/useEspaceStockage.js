import { useState, useEffect, useCallback } from 'react';

/* Juste l'estimation d'espace utilisé/disponible, pour affichage en
   lecture seule dans Réglages. La demande de stockage persistant elle-
   même se fait ailleurs, silencieusement (voir StockagePersistantSilencieux.jsx). */
export function useEspaceStockage() {
  const [usage, setUsage] = useState(null);
  const [quota, setQuota] = useState(null);

  const rafraichir = useCallback(async () => {
    if (!navigator.storage?.estimate) return;
    try {
      const { usage: u, quota: q } = await navigator.storage.estimate();
      setUsage(u ?? null);
      setQuota(q ?? null);
    } catch {
      // estimation indisponible : on n'affiche simplement rien
    }
  }, []);

  useEffect(() => { rafraichir(); }, [rafraichir]);

  return { usage, quota, rafraichir };
}
