// ═══════════════════════════════════════════════════════════════════════════
// compresserImage.js
//
// Compression d'images CÔTÉ NAVIGATEUR (à l'usage), pour les photos uploadées
// depuis le téléphone dans le journal de bord.
//
// ⚠️  À ne pas confondre avec /compresser-images.js (racine du projet) qui est
//     un script Node build-time (sharp) pour les images livrées avec l'app.
//
// Pour chaque fichier choisi, on décode l'image UNE seule fois puis on produit :
//   - une miniature (~600px)  → affichée dans la timeline et les galeries
//   - une version pleine (~1600px) → affichée en plein écran
//
// L'orientation EXIF (photos iPhone) est gérée nativement via createImageBitmap.
// ═══════════════════════════════════════════════════════════════════════════

// Décode un fichier image en respectant l'orientation EXIF.
async function chargerBitmap(file) {
  // Voie rapide et correcte sur Safari iOS 15+ / navigateurs modernes :
  // 'from-image' applique la rotation EXIF automatiquement.
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // Repli : passage par un <img> (cas exotiques / vieux navigateurs).
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((resoudre, rejeter) => {
        const i = new Image();
        i.onload = () => resoudre(i);
        i.onerror = () => rejeter(new Error('Image illisible'));
        i.src = url;
      });
      return await createImageBitmap(img);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

// Dessine le bitmap dans un canvas redimensionné (sans jamais agrandir).
function dessinerRedimensionne(bitmap, largeurMax) {
  const ratio = Math.min(1, largeurMax / bitmap.width);
  const largeur = Math.max(1, Math.round(bitmap.width * ratio));
  const hauteur = Math.max(1, Math.round(bitmap.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = largeur;
  canvas.height = hauteur;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, largeur, hauteur);

  return { canvas, largeur, hauteur };
}

function versBlobJpeg(canvas, qualite) {
  return new Promise((resoudre) =>
    canvas.toBlob((b) => resoudre(b), 'image/jpeg', qualite)
  );
}

/**
 * Prépare une photo à partir d'un File : miniature + version pleine.
 *
 * @param {File} file
 * @param {object} [opts]
 * @param {number} [opts.largeurPlein=1600]
 * @param {number} [opts.qualitePlein=0.8]
 * @param {number} [opts.largeurMini=600]
 * @param {number} [opts.qualiteMini=0.72]
 * @returns {Promise<{plein: Blob, miniature: Blob, largeur: number, hauteur: number}>}
 */
export async function preparerPhoto(
  file,
  {
    largeurPlein = 1600,
    qualitePlein = 0.8,
    largeurMini = 600,
    qualiteMini = 0.72,
  } = {}
) {
  const bitmap = await chargerBitmap(file);

  const plein = dessinerRedimensionne(bitmap, largeurPlein);
  const mini = dessinerRedimensionne(bitmap, largeurMini);

  const [blobPlein, blobMini] = await Promise.all([
    versBlobJpeg(plein.canvas, qualitePlein),
    versBlobJpeg(mini.canvas, qualiteMini),
  ]);

  // Libère la mémoire du bitmap décodé.
  if (typeof bitmap.close === 'function') bitmap.close();

  return {
    plein: blobPlein,
    miniature: blobMini,
    largeur: plein.largeur,
    hauteur: plein.hauteur,
  };
}
