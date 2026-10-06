// Usage (depuis la racine du projet) :
//   node convertir-webp.mjs public/images/jeux/taquin
//   node convertir-webp.mjs public/images/jeux/taquin 900 80      (largeur max px, qualité)
// 1. Convertit chaque .png/.jpg du dossier (sous-dossiers compris) en .webp
// 2. Met les originaux de côté dans _sauvegarde-images/<dossier> (hors de public/)
// 3. Met à jour les références dans src/, index.html et public/ (hors images)
//    — seulement celles qui pointent vers CE dossier, ou un nom nu (sans chemin).
import sharp from 'sharp';
import { readdir, readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';

const DOSSIER = (process.argv[2] ?? '').replace(/\\/g, '/').replace(/\/$/, '');
const LARGEUR_MAX = Number(process.argv[3] ?? 900);
const QUALITE = Number(process.argv[4] ?? 80);
if (!DOSSIER) { console.error('Indique le dossier : node convertir-webp.mjs public/images/jeux/taquin'); process.exit(1); }

const SAUVEGARDE = path.join('_sauvegarde-images', DOSSIER.replace(/^public\/images\/?/, '') || 'images');
const URL_DOSSIER = '/' + DOSSIER.replace(/^public\//, '');   // ex. /images/jeux/taquin

async function* parcourir(dir, ignorer = () => false) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (ignorer(p)) continue;
    if (e.isDirectory()) yield* parcourir(p, ignorer);
    else yield p;
  }
}

const renommages = []; // { nom, neuf, sousDossier }
let avant = 0, apres = 0;

for await (const src of parcourir(DOSSIER)) {
  const ext = path.extname(src).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
  const rel = path.relative(DOSSIER, src);
  const sous = path.dirname(rel).replace(/\\/g, '/').replace(/^\.$/, '');
  const base = path.basename(src, path.extname(src));
  const dest = path.join(path.dirname(src), `${base}.webp`);
  const tailleAvant = (await stat(src)).size;
  await sharp(src, { failOn: 'none' }).rotate()
    .resize({ width: LARGEUR_MAX, withoutEnlargement: true })
    .webp({ quality: QUALITE, effort: 6 })
    .toFile(dest);
  const tailleApres = (await stat(dest)).size;
  const dossierSauv = path.join(SAUVEGARDE, path.dirname(rel));
  await mkdir(dossierSauv, { recursive: true });
  await rename(src, path.join(dossierSauv, path.basename(src)));
  renommages.push({ nom: path.basename(src), neuf: `${base}.webp`, sous });
  avant += tailleAvant; apres += tailleApres;
  console.log(`${rel}  ${(tailleAvant/1024).toFixed(0)} Ko → ${(tailleApres/1024).toFixed(0)} Ko`);
}
console.log(`\n${renommages.length} images : ${(avant/1048576).toFixed(1)} Mo → ${(apres/1048576).toFixed(1)} Mo`);

// Mise à jour des références dans le code
const TEXTE = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.html'];
const cibles = ['index.html'];
for (const racine of ['src', 'public']) {
  try {
    for await (const f of parcourir(racine, (p) => p.replace(/\\/g, '/').startsWith('public/images'))) cibles.push(f);
  } catch {}
}
const echap = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let modifs = 0;
for (const f of cibles) {
  if (!TEXTE.includes(path.extname(f).toLowerCase())) continue;
  let txt;
  try { txt = await readFile(f, 'utf8'); } catch { continue; }
  let nouveau = txt;
  for (const { nom, neuf, sous } of renommages) {
    const attendu = URL_DOSSIER + (sous ? '/' + sous : '') + '/';
    const motif = new RegExp(`((?:[\\w@~.-]*[/\\\\])*)${echap(nom)}(?![\\w])`, 'g');
    nouveau = nouveau.replace(motif, (m, prefixe, offset, s) => {
      if (offset > 0 && /[\w.-]/.test(s[offset - 1])) return m;   // fait partie d'un autre mot
      const p = prefixe.replace(/\\/g, '/');
      return (p === '' || p.endsWith(attendu) || ('/' + p).endsWith(attendu)) ? `${prefixe}${neuf}` : m;
    });
  }
  if (nouveau !== txt) { await writeFile(f, nouveau); modifs++; console.log(`référence mise à jour : ${f}`); }
}
console.log(`\n${modifs} fichier(s) de code modifié(s). Originaux dans ${SAUVEGARDE}/`);
console.log('Vérifie aussi à la main : cherche ".png" / ".jpg" dans src/ pour les références construites par le code.');
