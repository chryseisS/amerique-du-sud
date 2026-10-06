// Usage (depuis la racine du projet) :  node optimiser-images.mjs
// Réduit le poids des .png/.jpg de public/images SANS changer ni le nom ni l'extension.
import sharp from 'sharp';
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DOSSIER = process.argv[2] ?? 'public/images';
const LARGEUR_MAX = 1000;   // plus large que ça = redimensionné (inutile sur un téléphone)
const QUALITE_JPG = 78;
const QUALITE_PNG = 80;

async function* parcourir(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* parcourir(p);
    else yield p;
  }
}

let avant = 0, apres = 0, n = 0;
for await (const f of parcourir(DOSSIER)) {
  const ext = path.extname(f).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
  const original = await readFile(f);
  let img = sharp(original, { failOn: 'none' }).rotate()
    .resize({ width: LARGEUR_MAX, withoutEnlargement: true });
  img = ext === '.png'
    ? img.png({ palette: true, quality: QUALITE_PNG, compressionLevel: 9, effort: 10 })
    : img.jpeg({ quality: QUALITE_JPG, mozjpeg: true });
  const sortie = await img.toBuffer();
  avant += original.length;
  if (sortie.length < original.length) {       // on n'écrase que si c'est plus léger
    await writeFile(f, sortie);
    apres += sortie.length;
    console.log(`${path.relative(DOSSIER, f)}  ${(original.length/1024).toFixed(0)} Ko → ${(sortie.length/1024).toFixed(0)} Ko`);
  } else apres += original.length;
  n++;
}
console.log(`\n${n} images : ${(avant/1048576).toFixed(1)} Mo → ${(apres/1048576).toFixed(1)} Mo`);
