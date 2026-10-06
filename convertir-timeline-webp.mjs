// Usage (depuis la racine du projet) :  node convertir-timeline-webp.mjs
// 1. Convertit chaque .png/.jpg de public/images/timeline en .webp (carrées ou non, max 700 px)
// 2. Met les originaux de côté dans _sauvegarde-images/timeline (hors de public/ : pas embarqués dans l'app)
// 3. Remplace "nom.png" / "nom.jpg" par "nom.webp" dans src/, index.html et public/ (hors images)
import sharp from 'sharp';
import { readdir, readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';

const DOSSIER = 'public/images/timeline';
const SAUVEGARDE = '_sauvegarde-images/timeline';
const LARGEUR_MAX = 700;
const QUALITE = 78;

async function* parcourir(dir, ignorer = () => false) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (ignorer(p)) continue;
    if (e.isDirectory()) yield* parcourir(p, ignorer);
    else yield p;
  }
}

await mkdir(SAUVEGARDE, { recursive: true });
const renommages = []; // [ancien nom de fichier, nouveau]
let avant = 0, apres = 0;

for (const nom of await readdir(DOSSIER)) {
  const ext = path.extname(nom).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
  const src = path.join(DOSSIER, nom);
  const base = path.basename(nom, path.extname(nom));
  const dest = path.join(DOSSIER, `${base}.webp`);
  const tailleAvant = (await stat(src)).size;
  await sharp(src, { failOn: 'none' }).rotate()
    .resize({ width: LARGEUR_MAX, withoutEnlargement: true })
    .webp({ quality: QUALITE, effort: 6 })
    .toFile(dest);
  const tailleApres = (await stat(dest)).size;
  await rename(src, path.join(SAUVEGARDE, nom));
  renommages.push([nom, `${base}.webp`]);
  avant += tailleAvant; apres += tailleApres;
  console.log(`${nom}  ${(tailleAvant/1024).toFixed(0)} Ko → ${(tailleApres/1024).toFixed(0)} Ko`);
}
console.log(`\n${renommages.length} images : ${(avant/1048576).toFixed(1)} Mo → ${(apres/1048576).toFixed(1)} Mo`);

// Mise à jour des références dans le code
const TEXTE = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.html'];
const cibles = [];
for (const racine of ['src', 'public']) {
  try {
    for await (const f of parcourir(racine, (p) => p.replace(/\\/g, '/').startsWith('public/images'))) cibles.push(f);
  } catch {}
}
cibles.push('index.html');
let modifs = 0;
for (const f of cibles) {
  if (!TEXTE.includes(path.extname(f).toLowerCase())) continue;
  let txt;
  try { txt = await readFile(f, 'utf8'); } catch { continue; }
  let nouveau = txt;
  for (const [ancien, neuf] of renommages) {
    const motif = new RegExp(`(?<![\\w.-])${ancien.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w])`, 'g');
    nouveau = nouveau.replace(motif, neuf);
  }
  if (nouveau !== txt) { await writeFile(f, nouveau); modifs++; console.log(`référence mise à jour : ${f}`); }
}
console.log(`\n${modifs} fichier(s) de code modifié(s). Originaux dans ${SAUVEGARDE}/`);
