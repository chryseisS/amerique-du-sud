// ═══════════════════════════════════════════════════════════════════════════
// dates.js — Formatage des périodes du journal de bord (français)
//
// Les dates sont stockées en chaînes ISO 'YYYY-MM-DD'. On les parse à la main
// pour éviter les décalages de fuseau horaire (new Date('2025-03-12') est
// interprété en UTC et peut basculer la veille en heure locale).
// ═══════════════════════════════════════════════════════════════════════════

const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

function parseIso(iso) {
  const [a, m, j] = iso.split('-').map(Number);
  return new Date(a, m - 1, j);
}

/**
 * Formate une période lisible :
 *   un seul jour      → "12 mars 2025"
 *   même mois         → "12–15 mars 2025"
 *   même année        → "28 mars – 3 avril 2025"
 *   à cheval sur 2 ans→ "30 déc. 2025 – 2 janv. 2026"
 */
export function formaterPeriode(dateDebut, dateFin) {
  if (!dateDebut) return '';
  const d1 = parseIso(dateDebut);

  if (!dateFin || dateFin === dateDebut) {
    return `${d1.getDate()} ${MOIS[d1.getMonth()]} ${d1.getFullYear()}`;
  }

  const d2 = parseIso(dateFin);
  const memeAnnee = d1.getFullYear() === d2.getFullYear();
  const memeMois = memeAnnee && d1.getMonth() === d2.getMonth();

  if (memeMois) {
    return `${d1.getDate()}–${d2.getDate()} ${MOIS[d1.getMonth()]} ${d1.getFullYear()}`;
  }
  if (memeAnnee) {
    return `${d1.getDate()} ${MOIS[d1.getMonth()]} – ${d2.getDate()} ${MOIS[d2.getMonth()]} ${d1.getFullYear()}`;
  }
  return `${d1.getDate()} ${MOIS[d1.getMonth()]} ${d1.getFullYear()} – ${d2.getDate()} ${MOIS[d2.getMonth()]} ${d2.getFullYear()}`;
}

/** Nombre de jours du séjour (inclusif). */
export function nbJours(dateDebut, dateFin) {
  if (!dateDebut) return 0;
  if (!dateFin || dateFin === dateDebut) return 1;
  const a = parseIso(dateDebut);
  const b = parseIso(dateFin);
  return Math.round((b - a) / 86400000) + 1;
}

/** Étiquette de regroupement par mois : "Mars 2025". */
export function moisAnnee(iso) {
  if (!iso) return '';
  const d = parseIso(iso);
  const m = MOIS[d.getMonth()];
  return `${m.charAt(0).toUpperCase()}${m.slice(1)} ${d.getFullYear()}`;
}