// module Planification

export const PAYS = ['Pérou', 'Équateur', 'Bolivie', 'Chili', 'Argentine'];

export const TYPES_ACTIVITES = ['Trek', 'Visite','Divers'];

export const COULEURS_TYPES_ACTIVITES = {
  Trek: '#c9623f',
  Visite: '#7a4f2e',
  Divers: '#d4872a',
};

// module Pokédex faune

export const HABITATS = {
  altiplano:        { libelle: 'Altiplano',     icone: '⛰' },
  patagonie:        { libelle: 'Patagonie',     icone: '🌬' },
  'cote-pacifique': { libelle: 'Côte Pacifique', icone: '🌊' },
  'cote-atlantique':{ libelle: 'Côte Atlantique', icone: '🐋' },
  amazonie:         { libelle: 'Amazonie',      icone: '🌴' },
};

export const HABITATS_ORDRE = [
  'altiplano',
  'patagonie',
  'cote-pacifique',
  'cote-atlantique',
  'amazonie',
];

export const RARETE_LIBELLES = {
  1: 'commun',
  2: 'peu commun',
  3: 'rare',
};

// module Gastronomie

export const TYPES_GASTRONOMIE = ['Boisson', 'Plat', 'Dessert'];


export function versSlug(texte) {
  return texte
    .toLowerCase()
    .normalize('NFD')                  // sépare les accents des lettres
    .replace(/[\u0300-\u036f]/g, '')   // supprime les accents
    .replace(/\s+/g, '-')              // espaces → tirets
    .replace(/[^a-z0-9-]/g, '');       // supprime tout sauf lettres/chiffres/tirets
}


