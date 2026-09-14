import { useEffect } from 'react';

/* Demande le stockage persistant une fois au chargement de l'app, sans
   aucune UI — Chrome/Safari décident silencieusement (pas de fenêtre à
   valider), donc il n'y a rien d'utile à montrer à l'utilisateur ici.
   À monter une seule fois dans App.jsx, comme SurprisesWatcher. */
export default function StockagePersistantSilencieux() {
  useEffect(() => {
    if (navigator.storage?.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }, []);

  return null;
}
