export function cheminImage(chemin) {
  if (!chemin || !chemin.startsWith('/')) return chemin; // laisse tranquille les URL blob:/http: (photos du journal)
  return `${import.meta.env.BASE_URL}${chemin.slice(1)}`;
}