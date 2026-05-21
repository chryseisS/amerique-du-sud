// ═══════════════════════════════════════════════════════════════════════════
// compresser-images.js
//
// Script qui compresse et redimensionne automatiquement toutes les images
// d'un dossier source vers un dossier destination.
//
// Usage : node compresser-images.js
//
// Configuration :
//   - Met tes images brutes dans : ./images-brutes/
//   - Le script les compresse dans : ./public/images/activites/
//   - Redimensionne à 1200px de large maximum (garde le ratio)
//   - Compresse en JPEG qualité 78
// ═══════════════════════════════════════════════════════════════════════════

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

// ─── Configuration ──────────────────────────────────────────────────────────
const DOSSIER_SOURCE = './images-brutes';
const DOSSIER_DESTINATION = './public/images/activites';
const LARGEUR_MAX = 1200;       // pixels, max width
const QUALITE_JPEG = 78;        // 0-100, sweet spot pour photos
const EXTENSIONS_ACCEPTEES = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];

// ─── Formatage humain des tailles de fichier ────────────────────────────────
function formaterTaille(octets) {
  if (octets < 1024) return `${octets} o`;
  if (octets < 1024 * 1024) return `${(octets / 1024).toFixed(1)} Ko`;
  return `${(octets / 1024 / 1024).toFixed(2)} Mo`;
}

// ─── Le script principal ────────────────────────────────────────────────────
async function compresser() {
  console.log('🖼️  Compression d\'images en cours...\n');

  // Vérifie que le dossier source existe
  try {
    await fs.access(DOSSIER_SOURCE);
  } catch {
    console.error(`❌ Le dossier "${DOSSIER_SOURCE}" n'existe pas.`);
    console.error(`   Crée-le et mets-y tes images, puis relance.`);
    return;
  }

  // Crée le dossier de destination s'il n'existe pas
  await fs.mkdir(DOSSIER_DESTINATION, { recursive: true });

  // Liste tous les fichiers du dossier source
  const fichiers = await fs.readdir(DOSSIER_SOURCE);

  // Filtre pour ne garder que les images
  const images = fichiers.filter((f) =>
    EXTENSIONS_ACCEPTEES.includes(path.extname(f).toLowerCase())
  );

  if (images.length === 0) {
    console.log(`⚠️  Aucune image trouvée dans "${DOSSIER_SOURCE}".`);
    return;
  }

  console.log(`📂 ${images.length} image(s) à traiter\n`);

  let tailleTotaleAvant = 0;
  let tailleTotaleApres = 0;

  // Traite chaque image
  for (const nomFichier of images) {
    const cheminSource = path.join(DOSSIER_SOURCE, nomFichier);

    // Force l'extension de sortie en .jpg (on compresse tout en JPEG)
    const nomBase = path.parse(nomFichier).name;
    const nomSortie = `${nomBase}.jpg`;
    const cheminDestination = path.join(DOSSIER_DESTINATION, nomSortie);

    // Taille du fichier original
    const statsAvant = await fs.stat(cheminSource);
    const tailleAvant = statsAvant.size;
    tailleTotaleAvant += tailleAvant;

    // Compression + redimensionnement avec sharp
    await sharp(cheminSource)
      .rotate()  // applique la rotation EXIF (utile pour photos d'iPhone)
      .resize({
        width: LARGEUR_MAX,
        withoutEnlargement: true,  // ne pas agrandir les petites images
      })
      .jpeg({
        quality: QUALITE_JPEG,
        progressive: true,         // chargement progressif
        mozjpeg: true,             // encodage plus optimisé
      })
      .toFile(cheminDestination);

    // Taille du fichier compressé
    const statsApres = await fs.stat(cheminDestination);
    const tailleApres = statsApres.size;
    tailleTotaleApres += tailleApres;

    // Affichage du gain pour cette image
    const gain = (((tailleAvant - tailleApres) / tailleAvant) * 100).toFixed(0);
    console.log(
      `  ✅ ${nomSortie.padEnd(40)} ${formaterTaille(tailleAvant).padStart(10)} → ${formaterTaille(tailleApres).padStart(10)} (-${gain}%)`
    );
  }

  // Récap global
  const gainTotal = (
    ((tailleTotaleAvant - tailleTotaleApres) / tailleTotaleAvant) *
    100
  ).toFixed(0);

  console.log('');
  console.log(`📊 Récap :`);
  console.log(`   Avant : ${formaterTaille(tailleTotaleAvant)}`);
  console.log(`   Après : ${formaterTaille(tailleTotaleApres)}`);
  console.log(`   Gain  : -${gainTotal}%`);
  console.log('');
  console.log(`✨ Terminé ! Images compressées dans "${DOSSIER_DESTINATION}"`);
}

compresser().catch((err) => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});