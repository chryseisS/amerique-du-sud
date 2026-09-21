export function cheminImage(chemin) {
  if (!chemin || !chemin.startsWith('/')) return chemin;
  const base = import.meta.env.BASE_URL;
  if (chemin.startsWith(base)) return chemin; // déjà préfixé, on ne retouche pas
  return `${base}${chemin.slice(1)}`;
}