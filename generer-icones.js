import sharp from 'sharp';

const tailles = [
  { nom: 'apple-touch-icon.png', taille: 180 },
  { nom: 'icon-192.png', taille: 192 },
  { nom: 'icon-512.png', taille: 512 },
];

for (const { nom, taille } of tailles) {
  await sharp('./icone-source.png')
    .resize(taille, taille)
    .flatten({ background: '#c9623f' })
    .png()
    .toFile(`./public/${nom}`);
  console.log(`✓ ${nom}`);
}