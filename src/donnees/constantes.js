import lieux from './lieux.json';

// module Planification

export const PAYS = ['Pérou', 'Equateur', 'Bolivie', 'Chili', 'Argentine'];

export const TYPES_ACTIVITES = ['Trek', 'Randonnée', 'Culture', 'Nature', 'Faune', 'Excursion', 'Gastronomie', 'Divers'];

export const COULEURS_TYPES_ACTIVITES = {
  Trek:        '#c9623f', // terracotta
  Randonnée:   '#8a5a2b', // terre brûlée
  Culture:     '#9a5b8c', // mauve patrimoine
  Nature:      '#5e8c4a', // vert feuillage
  Faune:       '#2f8f7f', // sarcelle
  Excursion:   '#3a7ca5', // bleu eau
  Gastronomie: '#d4872a', // ambre
  Divers:      '#8a7560', // taupe
};

export const ICONES_TYPES_ACTIVITES = {
  Trek:        '/images/zones/trek.png',
  Randonnée:   '/images/zones/randonnee.png',
  Culture:     '/images/zones/culture.png',
  Nature:      '/images/zones/nature.png',
  Faune:       '/images/zones/faune.png',
  Excursion:   '/images/zones/excursion.png',
  Gastronomie: '/images/zones/gastronomie.png',
  Divers:      '/images/zones/divers.png',
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

export function paysDuSlug(slug) {
  return PAYS.find((p) => versSlug(p) === slug) || null;
}

// Drapeaux et images pour la page d'accueil Planification
export const DRAPEAUX = {
  'Pérou': '/images/planification/perou_flag.png',
  'Equateur': '/images/planification/equateur_flag.svg',
  'Bolivie': '/images/planification/bolivie_flag.svg',
  'Chili': '/images/planification/chili_flag.png',
  'Argentine': '/images/planification/argentine_flag.png',
};

export const IMAGES_PAYS = {
  'Pérou': '/images/planification/perou.jpg',
  'Equateur': '/images/planification/equateur.jpg',
  'Bolivie': '/images/planification/bolivie.jpg',
  'Chili': '/images/planification/chili.jpg',
  'Argentine': '/images/planification/argentine.jpg',
};

export const IMAGES_PAYS_HEADER = {
  'Pérou':    '/images/planification/header_perou.png',
  'Equateur': '/images/planification/header_equateur.png',
  'Bolivie':  '/images/planification/header_bolivie.png',
  'Chili':    '/images/planification/header_chili.png',
  'Argentine':'/images/planification/header_argentine.png',
};

export const ICONES_ZONES = {
  // Pérou
  'cuzco':           '/images/zones/cuzco.png',
  'arequipa':        '/images/zones/arequipa.png',
  'ayacucho':        '/images/zones/ayacucho.png',
  'huaraz':          '/images/zones/huaraz.png',
  'paracas':         '/images/zones/paracas.png',
  'chiclayo-trujillo':   '/images/zones/nord-perou.png',
 
  // Bolivie
  'la-paz':          '/images/zones/la-paz.png',
  'uyuni':           '/images/zones/uyuni.png',
  'cochabamba':      '/images/zones/cochabamba.png',
 
  // Equateur
  'quito':           '/images/zones/quito.png',
  'cuenca':          '/images/zones/cuenca.png',
  'ambato':          '/images/zones/ambato.png',
 
  // Chili
  'nord-du-chili':       '/images/zones/nord-du-chili.png',
  'carretera-austral':  '/images/zones/carretera-austral.png',
 
  // Argentine
  'patagonie':       '/images/zones/patagonie.png',
  'terre-de-feu':    '/images/zones/terre-de-feu.png',
  'salta':           '/images/zones/salta.png',
  'mendoza':         '/images/zones/mendoza.png',
  'san-carlos-de-bariloche':         '/images/zones/bariloche.png',
};

export const ZONES_SI_TEMPS = ['Nord du Pérou', 'Ayacucho'];

export const estIncontournable = (a) => (a.importance ?? 0) >= 5;

const lieuParSlug = new Map(lieux.map((l) => [versSlug(l.nom), l]));

export function zonesDuPays(activites, pays) {
  const parZone = new Map();
  for (const a of activites) {
    if (a.pays !== pays) continue;
    const slug = versSlug(a.lieu);
    if (!parZone.has(slug)) {
      const ref = lieuParSlug.get(slug);
      parZone.set(slug, {
        nom: a.lieu,
        slug,
        pays,
        type: ref?.type ?? 'ville',
        lieuId: ref?.id ?? null,
        nbActivites: 0,
        nbIncontournables: 0,
        optionnel: ZONES_SI_TEMPS.includes(a.lieu),
      });
    }
    const z = parZone.get(slug);
    z.nbActivites += 1;
    if (estIncontournable(a)) z.nbIncontournables += 1;
  }
  // tri : zones sûres d'abord, optionnelles (sablier) en bas
  return [...parZone.values()].sort((x, y) => {
    if (x.optionnel !== y.optionnel) return x.optionnel ? 1 : -1;
    return y.nbIncontournables - x.nbIncontournables || x.nom.localeCompare(y.nom, 'fr');
  });
}