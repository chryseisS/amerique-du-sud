import { useState, useEffect } from 'react';

/**
 * Comme useState, mais persiste dans sessionStorage sous une clé donnée.
 * Le state survit à la navigation (aller-retour sur une fiche détail)
 * mais est perdu à la fermeture de l'onglet.
 */
export function useEtatPersistant(cle, valeurInitiale) {
  const [valeur, setValeur] = useState(() => {
    try {
      const brut = sessionStorage.getItem(cle);
      return brut !== null ? JSON.parse(brut) : valeurInitiale;
    } catch {
      return valeurInitiale;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(cle, JSON.stringify(valeur));
    } catch {
      /* sessionStorage indisponible (mode privé safari ancien, etc.) */
    }
  }, [cle, valeur]);

  return [valeur, setValeur];
}