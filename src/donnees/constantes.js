// module Planification

export const PAYS = ['Pérou', 'Equateur', 'Bolivie', 'Chili', 'Argentine'];

export const TYPES_ACTIVITES = ['Trek', 'Visite','Divers', 'Excursion'];

export const COULEURS_TYPES_ACTIVITES = {
  Trek: '#c9623f',
  Visite: '#7a4f2e',
  Divers: '#d4872a',
  Excursion: '#d4872a'
};

// module Faune

export const RARETE_LIBELLES = {
  1: 'commun',
  2: 'peu commun',
  3: 'rare',
};

// module Gastronomie

export const TYPES_GASTRONOMIE = ['Boisson', 'Plat', 'Dessert'];

export const COULEURS_PAYS = {
  'Pérou':    { barre: '#C8763D', iconBg: '#FAECE7', iconText: '#993C1D', accent: '#C8763D' }, // terracotta
  'Bolivie':  { barre: '#639922', iconBg: '#EAF3DE', iconText: '#3B6D11', accent: '#639922' }, // vert
  'Chili':    { barre: '#185FA5', iconBg: '#E6F1FB', iconText: '#042C53', accent: '#185FA5' }, // bleu profond
  'Equateur': { barre: '#EF9F27', iconBg: '#FAEEDA', iconText: '#854F0B', accent: '#EF9F27' }, // jaune/or
  'Argentine':{ barre: '#7BB7E0', iconBg: '#E6F1FB', iconText: '#185FA5', accent: '#7BB7E0' }, // bleu ciel
};

export const COULEURS_TYPE = {
  Plat:    '#c9623f', // terracotta (terra-500)
  Boisson: '#7a4f2e', // brun (terra-700)
  Dessert: '#d4872a', // ambre
};

export const couleursDuPlat = (plat) => {
  const pays = Array.isArray(plat.pays) ? plat.pays[0] : plat.pays;
  return COULEURS_PAYS[pays] || COULEURS_PAYS['Pérou'];
};


export function versSlug(texte) {
  return texte
    .toLowerCase()
    .normalize('NFD')                  // sépare les accents des lettres
    .replace(/[\u0300-\u036f]/g, '')   // supprime les accents
    .replace(/\s+/g, '-')              // espaces → tirets
    .replace(/[^a-z0-9-]/g, '');       // supprime tout sauf lettres/chiffres/tirets
}


