import { useEffect, useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// useUrlBlob — transforme un Blob (IndexedDB) en URL affichable, et la révoque
// proprement au démontage / changement de blob (évite les fuites mémoire).
// ═══════════════════════════════════════════════════════════════════════════

/** Un seul blob → une seule URL. */
export function useUrlBlob(blob) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!blob) {
      setUrl(null);
      return undefined;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);

  return url;
}
