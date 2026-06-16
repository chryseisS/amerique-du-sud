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
    note: 'Le matériel se trouve dans un PDF, en dehors de l\u2019application. Aucune connexion internet n\u2019est nécessaire.',
  },
  {
    id: 'sherlock',
    titre: 'The Unsolved Case Files of Sherlock Holmes',
    sousTitre: 'Serez-vous meilleur que Sherlock ?',
    type: 'explication',
    image: '/images/jeux/enquetes/sherlock.jpg',
    explication: [
      "Le Dr Watson a laissé derrière lui un coffre contenant des affaires si complexes et mystérieuses que Sherlock Holmes lui-même a préféré les garder secrètes... jusqu'à aujourd'hui. Glissez-vous dans la peau du célèbre détective et tentez de résoudre ces énigmes que le reste du monde croyait insolubles."
    ],
    note: 'Le matériel se trouve dans deux PDF, en dehors de l\u2019application. Aucune connexion internet n\u2019est nécessaire.',

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
    note: 'Le matériel se trouve dans plusieurs PDF, en dehors de l\u2019application. Une connexion internet est nécessaire pour vérifier les réponses.',
  },
  {
    id: 'qui-ment',
    titre: 'Qui ment ?',
    sousTitre: null,
    type: 'liste',
    image: '/images/jeux/enquetes/qui-ment.jpg',
    cas: [
      {
        id: 'abattu',
        titre: 'ABATTU',
        histoire: [
          "L'inspecteur Alva interroge trois suspects dans le cadre de l'enquête sur la mort d'un médecin local, le Dr Fontaine, qui a été abattu dans son allée après être rentré tard du travail. Les suspects sont l'épouse du médecin, Mme Fontaine, un collègue du médecin, le Dr Bass, et un patient, M. Norton.",
          "Le Dr Fontaine a quitté son travail à 21 h 08, d'après les images de vidéosurveillance situées à l'extérieur de son cabinet. Le trajet en voiture entre son cabinet et son domicile dure environ 15 minutes. Le 9-1-1 a reçu plusieurs appels de voisins vers 21 h 25, mais personne n'a rien vu.",
          "Mme Fontaine était seule à la maison lorsque son mari s'est garé dans l' allée. Elle dit avoir entendu le coup de feu elle aussi, mais être d'abord sortie au lieu d'appeler. C'est alors qu'elle a trouvé son mari gisant dans l' allée, en sang.",
          "Il est de notoriété publique que le Dr Bass et le Dr Fontaine entretenaient une rivalité acharnée. En effet, le Dr Fontaine avait récemment reçu un prix que le Dr Bass estimait lui-même mériter, et il l’avait d’ailleurs fait savoir à toute l’assemblée lors de la cérémonie de remise des prix. « Non, je n’aimais pas le Dr Fontaine », répond le Dr Bass lorsqu’on l’interroge. « Mais je ne l’aurais jamais tué. J’étais seul chez moi toute la soirée, de 19 h jusqu’au lendemain matin. »",
          "M. Norton avait récemment quitté le cabinet du Dr Fontaine en colère parce que le médecin avait refusé de lui prescrire des analgésiques et l’avait orienté vers un centre de désintoxication. « Mais j’ai pris un nouveau départ depuis », dit M. Norton. « Je suis sorti faire un jogging en soirée de 21 h à 22 h ce soir-là. ».",
          "Mme Fontaine exige que l'inspecteur arrête M. Norton. « Ça ne peut être que lui », dit-elle. « Il habite à quelques kilomètres d'ici et aurait pu venir en courant jusqu'à chez nous. Il a dit à mon mari qu'il regretterait de ne pas lui avoir donné l'ordonnance. Il l'a menacé ! »",
          "« Mais c'était il y a un mois », dit l'inspecteur Alva. « Pourquoi aurait-il attendu si longtemps ? »",
          "« Peut-être qu’il devait d’abord tout planifier », dit Mme Fontaine. « Il était dehors, soi-disant en train de faire son jogging, exactement au moment où mon mari s’est fait tirer dessus ! »",
          "« Je vais toujours courir à la même heure tous les soirs maintenant », dit M. Norton. « Et je ne m’approche pas du tout de l’endroit où habite le Dr Fontaine quand je cours. Vous devriez vraiment vous intéresser davantage au Dr Bass. Tout le monde sait qu’il détestait le Dr Fontaine. »",
          "« Je regardais le journal télévisé de 21 h quand la fusillade a eu lieu », dit le Dr Bass. « Je peux vous raconter chaque flash d’info : ils couvraient en direct l’incendie d’un entrepôt. Je vous le promets. Je n’ai rien à voir avec le meurtre du Dr Fontaine. »",
          "« Il aurait pu lire toutes ces informations en ligne plus tard », dit M. Norton. « À quelle heure a eu lieu cet incendie, d’ailleurs ? »",
          "« Je sais que l’incendie a eu lieu avant 21 h 15 », dit Mme Fontaine. « Je le sais parce que je regardais moi-même le journal télévisé et c’est à cette heure-là que j’ai entendu le coup de feu. »"
        ],
        question: 'Quel suspect ment ?',
      },
      {
        id: 'coupable',
        titre: "QUELQU'UN EST COUPABLE, C'EST CERTAIN",
        histoire: [
          "Un vol a eu lieu au Hardy’s Bar, un établissement très apprécié des habitants de Malory Rock, dans le Maine. Les employés ont constaté que l’argent avait été dérobé peu après la fermeture, vendredi soir. La police a interrogé trois suspects le lendemain : Amy, la barmaid qui travaillait le soir du vol ; Stan, un client du bar ; et Alexa, une cliente turbulente à qui on avait demandé de quitter les lieux ce soir-là. Ils ont recueilli les déclarations suivantes :",
          "**Amy** : La nuit dernière a été difficile. J’ai travaillé jusqu’à la fermeture et j’ai eu affaire à des clients particulièrement difficiles au bar. Une fille avait déjà beaucoup bu lorsqu’elle est entrée et s’est assise au bar. Elle a commandé deux Long Island Iced Teas et est devenue de plus en plus agressive jusqu’à ce que nous devions finalement la mettre à la porte. Peu de temps après, j’ai fermé le bar pour la nuit et lorsque je l’ai rouvert aujourd’hui, l’argent avait disparu.",
          "**Stan** : J’ai bu quelques bières chez Hardy’s vers minuit. Une fille ivre est entrée, s’est assise à côté de moi et n’arrêtait pas de se plaindre de la grossièreté du barman à son égard. Elle n’arrêtait pas de me demander si je voulais une gorgée de son verre. Ça ressemblait à un Long Island Iced Tea. J’ai poliment refusé, puis je suis parti. J’ai entendu dire qu’elle s’était fait mettre dehors plus tard dans la nuit.",
          "**Alexa** : Je déteste le Hardy’s Bar. Le barman a été vraiment grossier avec moi hier soir. Je suis entrée et j’ai bu seulement deux verres, rien qui contenait d’alcool fort. Et puis ils m’ont demandé de partir ! C’était vraiment injuste la façon dont ils m’ont traitée. Je n’y remettrai plus jamais les pieds.",
          "Après avoir examiné les déclarations des témoins, les enquêteurs ont pu établir que l'un des suspects ne disait pas la vérité au sujet des événements de cette nuit-là."
        ],
        question: "Quel témoin mentait, et comment l'ont-ils su ?",
      },
      {
        id: 'ventes-suspectes',
        titre: "VENTES SUSPECTES",
        histoire: [
          "Après avoir enquêté sur plusieurs cambriolages commis dans la région au cours de la semaine dernière, la police soupçonne que certains objets volés auraient été vendus au prêteur sur gages Manny’s. Afin d’identifier les cambrioleurs, la police a interrogé les témoins suivants, qui fréquentent le magasin et qui ont vu un suspect de sexe masculin vendre un grand nombre d’objets. Parmi les témoins figurent : Danielle, une employée du prêteur sur gages ; Alex, un client ; et Johnny, le fils de Danielle âgé de 11 ans, qui se trouve souvent dans les locaux du prêteur sur gages après l'école. La police a recueilli les déclarations suivantes des témoins :",
          "**Danielle** : Oui, j’ai vu un homme entrer avec plein d’appareils électroniques et de bijoux. Il était grand, avait les cheveux foncés et portait une moustache. J’ai enregistré toutes les ventes, et il est reparti rapidement — il m’a à peine adressé la parole. De la fenêtre, je l’ai vu monter dans un monospace et s’éloigner. Je n’y ai pas prêté attention. J’ai traité beaucoup de ventes ce jour-là, mais je reconnaîtrais cet homme si je le revoyais.",
          "**Alex** : J'attendais mon tour derrière un autre type au prêteur sur gages. Sa vente a pris un certain temps, il avait beaucoup d'objets : des ordinateurs portables, des tablettes, des bijoux, toutes sortes de choses. Il est finalement reparti avec ce que j'imagine être une belle somme d'argent, et c'est la dernière fois que je l'ai vu. Je ne l'ai pas bien regardé, mais c'était un grand gaillard. Il est reparti dans une voiture qui faisait un bruit incroyable sur le parking.",
          "**Johnny** : Ma mère était occupée à la caisse avec un type costaud qui avait plein de trucs à vendre, alors j’ai pris mon vélo pour aller faire un tour sur le parking. Parfois, quand je m'ennuie, je compte le nombre de voitures sur le parking. C'était une journée chargée, donc il y en avait beaucoup. J'ai compté 4 voitures, 3 camions et 1 moto. La moto était vraiment cool, mais je suis rentré avant de pouvoir voir à qui elle appartenait. Je l'ai entendue partir, par contre, elle faisait un bruit d'enfer !",
          "Après avoir examiné ces déclarations, la police a conclu que l'un des témoins ne disait pas la vérité et l'a soumis à un interrogatoire plus approfondi."
        ],
        question: "Quel témoin mentait, et comment l'ont-ils su ?",
      },
      {
        id: 'soiree-bibliotheque',
        titre: "UNE SOIRÉE TARDIVE À LA BIBLIOTHÈQUE",
        histoire: [
          "À l'université d'Atlantic Coast State, une étudiante nommée Kathy a disparu. Elle a été vue pour la dernière fois en train de sortir seule de la bibliothèque de l'université dans la nuit du 1er novembre. Les enquêteurs ont décidé d'interroger trois témoins qui ont été les derniers à voir Kathy avant sa disparition : Roxanne, une bibliothécaire de l'université ; Alana, une camarade de classe ; et David, le petit ami de Kathy. Ils ont recueilli les déclarations suivantes :",
          "**Roxanne** : J'ai vu Kathy en train d'étudier avec un camarade de classe au quatrième étage. Ils travaillaient sur un devoir pour un cours de littérature, et elle m'a demandé où elle pouvait trouver des romans des XVIIIe et XIXe siècles. Je lui ai indiqué l'endroit, puis elle et l'autre étudiant ont pris quelques livres et se sont remis au travail. Son camarade est parti vers 21 h, et Kathy est restée encore une demi-heure environ avant de partir.",
          "**Alana** : Kathy et moi avons travaillé sur un devoir pour notre cours de littérature de l'époque romantique ce soir-là. Nous écrivions sur Jane Austen, alors nous avons pris des exemplaires de trois de ses livres : Orgueil et Préjugés, Raison et Sentiments et La Locataire de Wildfell Hall. Après les avoir parcourus, nous avons terminé le devoir, et je suis partie vers 21 h. Kathy m’a dit qu’elle allait travailler un peu sur d’autres devoirs, et elle semblait contrariée par quelque chose. Je ne l’ai pas revue depuis.",
          "**David** : J'ai envoyé un SMS à Kathy vers 21 h 15 ce soir-là, et elle m'a dit qu'elle finissait ses devoirs. Je lui ai proposé de passer chez moi après, et elle a accepté. Vers 21 h 30, j'ai reçu un SMS de sa part m'indiquant qu'elle était en route, mais elle n'est jamais arrivée. J'ai fini par l'appeler vers 22 h 30, mais elle n'a pas répondu. C'est la dernière fois que j'ai eu de ses nouvelles.",
          "Après avoir examiné ces déclarations, la police a conclu que l'un des témoins ne disait pas la vérité et l'a soumis à un interrogatoire plus approfondi."
        ],
        question: "Quel témoin mentait, et comment l'ont-ils su ?",
      },
      {
        id: 'disparu',
        titre: "DISPARU EN UN CLIN D'OEIL",
        histoire: [
          "Une jeune femme prénommée Alexis a disparu à New York le 28 juillet. Elle a été vue pour la dernière fois alors qu'elle quittait l'immeuble Criterion Arms, où elle habitait, vers 7 heures du matin. Alexis vivait seule et sa disparition n'a été signalée que près de deux jours plus tard. La police, qui soupçonne un acte criminel, a interrogé trois témoins de l'immeuble : Larry, le portier ; Anna, sa voisine d'à côté ; et Timothy, le facteur. Interrogés sur leur dernière interaction avec Alexis, les témoins ont fait les déclarations suivantes :",
          "**Larry** : « Alexis était une fille sympa, d’ordinaire très bavarde, mais elle était restée très silencieuse pendant la semaine qui a précédé sa disparition. Je l’ai vue entrer dans l’immeuble vers 4 heures du matin le 28. Elle s’est dirigée directement vers l’ascenseur et est montée au 5e étage, où elle habitait, sans m’adresser la parole, ce qui était inhabituel. Elle s’est changée et a quitté l’immeuble juste avant 7 heures ce même matin. Personne ne l’a revue depuis. »",
          "**Anna** : « Alexis est d'habitude une voisine formidable, mais dans la nuit du 27, elle m'a empêchée de dormir toute la nuit à cause de la musique à fond qui venait de son appartement. J'ai frappé à sa porte plusieurs fois pendant la nuit, mais personne n'a répondu. J'avais l'impression d'entendre, à travers le mur, qu'elle faisait du bruit en jetant des objets. C'était très agaçant. La musique n'a cessé que juste avant que mon réveil ne sonne pour aller travailler. Je ne l'ai ni vue ni entendue depuis. »",
          "**Timothy** : « Je distribuais le courrier vers 6 h 50 le 28 quand j'ai aperçu Alexis dans la salle du courrier. Elle avait l'air très fatiguée et m'a dit qu'elle n'était rentrée chez elle que quelques heures auparavant. Elle attendait un colis et m'a demandé de vérifier si j'avais quelque chose pour elle. Effectivement, il y avait un petit paquet à son nom. Elle l'a mis dans son sac et a quitté le bâtiment juste après. »",
          "Après avoir examiné ces déclarations, la police a conclu que l'un des témoins ne disait pas la vérité et l'a soumis à un interrogatoire plus approfondi."
        ],
        question: "Quel témoin mentait, et comment l'ont-ils su ?",
      },
      {
        id: 'miser-reponse',
        titre: "MISER SUR UNE RÉPONSE",
        histoire: [
          "Une tentative de braquage a eu lieu à la Golden Bel Bank à 11 heures du matin. Le suspect portait un masque pour dissimuler son identité et s'est enfui peu après avoir remis un message menaçant au guichetier et exigé de l'argent. La police a arrêté trois suspects potentiels dans cette affaire : Robert, un ancien employé de la Golden Bel Bank ; Cameron, un habitant du quartier ayant des antécédents judiciaires ; et David, le propriétaire d'un restaurant voisin. Interrogés sur leur alibi au moment de la tentative de braquage, ils ont fait les déclarations suivantes :",
          "**Robert** : « Je devais aller chercher ma dernière paie ce matin-là, mais je n’y suis jamais allé. J’ai découvert une fuite dans mon appartement et j’ai tout de suite appelé un plombier. Je suis resté chez moi à essayer de limiter les dégâts jusqu’à l’arrivée du plombier, peu après 11 h 30. »",
          "**Cameron** : « Je me promenais en voiture avec mes amis. On était dans le coin, mais on n’a pas eu d’ennuis. Mon pote s’est arrêté à la station-service en face de la banque et a fait le plein. C’est le plus près que je sois allé de les lieux. Après ça, on a traversé la ville pour déposer notre ami au cinéma, où il allait travailler. »",
          "**David** : « J’étais au restaurant, dans mon bureau. J’étais au téléphone, en train de commander davantage de vin français, car ce type de vin a beaucoup de succès ces derniers temps. Mes clients demandent beaucoup de prosecco pendant le service du dîner, alors ce matin-là, j’ai appelé mon distributeur pour en commander davantage. Ensuite, je me suis préparé pour le service du déjeuner prévu à midi. »",
          "Après avoir examiné ces déclarations, la police a conclu que l'un des témoins ne disait pas la vérité et l'a soumis à un interrogatoire plus approfondi."
        ],
        question: "Quel témoin mentait, et comment l'ont-ils su ?",
      },
      {
        id: 'crime-parfait',
        titre: "UN CRIME PARFAIT, À COUP SÛR",
        histoire: [
          "Plusieurs chiens de grande valeur ont été volés à la clinique vétérinaire Chestnut Fals dans la nuit du 7 juin. Parmi les chiens volés figurent un samoyède, un bouledogue anglais et un chow-chow. La police a interrogé les témoins suivants, qui ont été les derniers à avoir été en contact avec les animaux : Amber, une assistante vétérinaire ; Dawn, une étudiante effectuant un stage d'été à la clinique ; et Toby, le propriétaire du bouledogue anglais. Elle a recueilli les déclarations suivantes :",
          "**Amber** : Les trois chiens qui ont été enlevés étaient presque complètement remis de leurs problèmes de santé. Je sais que le Chow Chow était soigné pour une dysplasie de la hanche et que le bouledogue se remettait d'une opération. Les copies de leurs certificats de race ont également été volées, donc celui qui a fait ça a l'intention de les vendre à prix fort. J'ai vu les chiens pour la dernière fois l'après-midi du 7 juin, alors que je travaillais au bureau. Le vétérinaire m'avait dit que les trois chiens seraient probablement autorisés à quitter notre clinique le lendemain.",
          "**Dawn** : J'adorais m'occuper de ces adorables chiens ! La chow-chow qui avait des problèmes de hanche était ma préférée : elle sortait toujours sa grosse langue rose quand j'apportais à manger dans les chenils. J'ai donné à manger et à boire à tous les animaux le soir du 7 juin, avant de quitter le bureau pour la nuit. Quand je suis revenue le lendemain matin pour ouvrir la porte d'entrée, les portes de leurs chenils étaient ouvertes et les chiens avaient disparu.",
          "**Toby** : C'est une clinique vétérinaire très chère et je ne m'attendais vraiment pas à ce que quelque chose comme ça arrive. Reginald, mon bouledogue anglais, est avec moi depuis près de six ans. Quand je l'ai emmené se faire opérer la semaine dernière, ils m'ont dit que tout s'était bien passé et qu'il se remettait bien. Il devait rentrer à la maison le 8 juin.",
          "Après avoir examiné ces déclarations, la police a conclu que l'un des témoins ne disait pas la vérité et l'a soumis à un interrogatoire plus approfondi."
        ],
        question: "Quel témoin mentait, et comment l'ont-ils su ?",
      },
      {
        id: 'meurtre-hotel',
        titre: "MEURTRE À L'HÔTEL",
        histoire: [
          "Un corps a été découvert dans la chambre 512 de l'hôtel Bluegil. La police a conclu que la mort de cet homme était due à un homicide. Les enquêteurs ont interrogé trois personnes qui se trouvaient dans l'enceinte de l'hôtel la nuit du meurtre : Hilary, une femme de ménage de l'hôtel qui a découvert la victime ; Jacob, un client logeant dans une chambre voisine ; et Rebecca, la sœur de la victime et la dernière personne à avoir été en contact avec lui. Ils ont recueilli les témoignages suivants :",
          "**Hillary** : J'ai frappé à la porte de la chambre 512 dans l'après-midi pour faire le ménage. Comme personne ne répondait, je suis entrée dans la chambre. J'ai éteint la télévision, allumé les lumières et commencé à ranger la chambre. L'une des ampoules de la lampe était grillée, je l'ai donc remplacée. J'ai également réapprovisionné le minibar, dans lequel il manquait plusieurs petites bouteilles d'alcool. Quand je suis arrivée dans la salle de bains, j'ai découvert le corps de l'homme.",
          "**Jacob** : Je n’ai entendu aucun bruit fort ni aucun bruit de lutte venant de l’autre côté du couloir cette nuit-là. À un moment donné, j’ai entendu la porte s’ouvrir et quelqu’un entrer dans la chambre. Quand je suis allé plus tard dans la soirée chercher de la glace dans la salle des distributeurs, vers 19 h 30, j’ai remarqué que la porte était légèrement entrouverte et qu’il y avait de la lumière et que le son d’une télévision se propageait dans le couloir. On aurait dit qu'ils regardaient le match des Lakers à la télévision. Quand j'ai quitté ma chambre le lendemain matin, la porte était complètement fermée, donc je n'y ai pas prêté attention.",
          "**Rebecca** : Après avoir reçu un appel me demandant de venir à l'hôtel, je suis allée voir mon frère. Il était dans la chambre 512, ce que j'ai trouvé drôle car c'était notre ancien indicatif régional quand nous vivions à Los Angeles quand nous étions enfants. J'étais tellement contente de le voir, même s'il m'a dit qu'il allait quitter la ville le lendemain matin. On a bu quelques verres du minibar et regardé la télé ensemble, comme au bon vieux temps. Je suis partie vers 22 h. C'était la dernière fois que je le voyais.",
          "Après avoir examiné ces déclarations, la police a conclu que l'un des témoins ne disait pas la vérité et l'a soumis à un interrogatoire plus approfondi."
        ],
        question: "Quel témoin mentait, et comment l'ont-ils su ?",
      },
    ],
  },
];

export const sectionParId = (id) => SECTIONS.find((s) => s.id === id);
export const casParId = (section, casId) => section?.cas?.find((c) => c.id === casId);