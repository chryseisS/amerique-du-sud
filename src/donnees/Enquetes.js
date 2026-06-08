// ════════════════════════════════════════════════════════════════════
//  DONNÉES — Detective Cases  (/jeux/enquetes)
//  ────────────────────────────────────────────────────────────────────
//  POUR AJOUTER UNE SECTION : ajoute un objet dans SECTIONS.
//    • type: 'explication'  → page descriptive seule (contenu = livre/PDF externe)
//    • type: 'liste'        → liste d'affaires ; chaque affaire = { id, titre, histoire[], question }
//  POUR AJOUTER UNE AFFAIRE : ajoute un objet dans le tableau `cas` de la section.
//  Les images vont dans public/images/jeux/enquetes/  (un fond sépia s'affiche si absente).
// ════════════════════════════════════════════════════════════════════

export const SECTIONS = [
  {
    id: 'murdle',
    titre: 'Murdle Book',
    sousTitre: null,
    type: 'explication',
    image: '/images/jeux/enquetes/murdle.jpg',
    explication: [
      "Devenez le Détective Logico ! Chaque jour, un nouveau crime absurde a été commis. Armé de votre grille de logique, de votre perspicacité et d'une bonne dose d'humour noir, vous devez croiser les indices pour déduire qui est le coupable, avec quelle arme, et dans quel lieu. Il y a 100 criminels à démasquer !",
    ],
    note: 'Le matériel se trouve un PDF, en dehors de l\u2019application. Aucune connexion internet n\u2019est nécessaire.',
  },
  {
    id: 'sherlock',
    titre: 'The Unsolved Case Files of Sherlock Holmes',
    sousTitre: 'Serez-vous meilleur que Sherlock ?',
    type: 'liste',
    image: '/images/jeux/enquetes/sherlock.jpg',
    cas: [
      {
        id: 'condor-noir',
        titre: 'Le mystère du Condor Noir',
        histoire: [
          "Un collectionneur est retrouvé sans vie dans son bureau fermé de l'intérieur, une plume de condor noir posée sur son bureau. La fenêtre est entrouverte, mais aucune empreinte sur le rebord.",
          "Trois visiteurs avaient rendez-vous ce soir-là : son associé, venu signer un contrat ; sa nièce, à qui il devait de l'argent ; et un antiquaire rival, éconduit la semaine passée. Chacun jure être parti avant la tombée de la nuit.",
          "Sur la tasse de thé encore tiède, une seule trace de rouge à lèvres. La pendule, elle, s'est arrêtée à 21h04 — bien après le coucher du soleil.",
        ],
        question: 'Qui a commis le crime ?',
      },
    ],
  },
  {
    id: 'stop-a-murder',
    titre: 'Stop a Murder',
    sousTitre: null,
    type: 'explication',
    image: '/images/jeux/enquetes/stop-a-murder.jpg',
    explication: [
      "Glissez-vous dans la peau d'un profileur du FBI. Face à vous : un dossier criminel brut (rapports d'autopsie, indices physiques, lettres du tueur) et un compte à rebours mortel. Votre mission est d'arrêter un tueur en série machiavélique avant sa prochaine victime.",
    ],
    note: 'Le matériel se trouve un PDF, en dehors de l\u2019application. Une connexion internet est nécessaire pour vérifier les réponses.',
  },
  {
    id: 'qui-ment',
    titre: 'Qui ment ?',
    sousTitre: null,
    type: 'liste',
    image: '/images/jeux/enquetes/qui-ment.jpg',
    cas: [
      {
        id: 'tresor-cusco',
        titre: 'Le trésor disparu de Cusco',
        histoire: [
          "Au petit matin, le conservateur du musée Inka de Cusco découvre que la statuette d'or de Viracocha a disparu de sa vitrine. Aucune trace d'effraction.",
          "Trois personnes possédaient une clé de la salle. La gardienne de nuit affirme n'avoir quitté son poste qu'une fois, à 3h, pour cinq minutes. Le restaurateur d'art jure être rentré chez lui à 19h et ne jamais être revenu. Le neveu du conservateur dit avoir passé la nuit chez un ami — un ami qui, justement, travaille aussi au musée.",
          "La poussière sur le rebord de la vitrine n'a été dérangée que d'un seul côté. Et la caméra du couloir est tombée en panne à 19h15.",
        ],
        question: 'Qui ment ?',
      },
      {
        id: 'vol-valparaiso',
        titre: 'Le vol à Valparaíso',
        histoire: [
          "Dans une ruelle colorée de Valparaíso, un portefeuille plein disparaît d'un sac à dos pendant une fête de quartier. Quatre amis étaient autour de la table.",
          "Le premier dit n'avoir pas bougé de sa chaise. Le deuxième assure être allé chercher des boissons et avoir tout vu de loin. La troisième affirme qu'elle dansait, dos au sac. Le dernier prétend être arrivé après la disparition.",
          "Pourtant, une photo prise à 22h17 montre clairement deux d'entre eux à des endroits qui contredisent leur version.",
        ],
        question: 'Qui ment ?',
      },
    ],
  },
];

export const sectionParId = (id) => SECTIONS.find((s) => s.id === id);
export const casParId = (section, casId) => section?.cas?.find((c) => c.id === casId);