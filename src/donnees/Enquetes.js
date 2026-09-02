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
    image: '/images/jeux/enquetes/murdle-book.png',
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
    image: '/images/jeux/enquetes/sherlock.png',
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
    image: '/images/jeux/enquetes/stop-a-murder.png',
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
    image: '/images/jeux/enquetes/qui-ment.png',
    cas: [
      {
        id: 'abattu',
        titre: 'ABATTU',
        histoire: [
          "L'inspecteur Alva interroge trois suspects dans le cadre de l'enquête sur la mort d'un médecin local, le Dr Fontaine, qui a été abattu dans son allée après être rentré tard du travail. Les suspects sont l'épouse du médecin, Mme Fontaine, un collègue du médecin, le Dr Bass, et un patient, M. Norton.",
          "Le Dr Fontaine a quitté son travail à 21 h 08, d'après les images de vidéosurveillance situées à l'extérieur de son cabinet. Le trajet en voiture entre son cabinet et son domicile dure environ 15 minutes. Le 9-1-1 a reçu plusieurs appels de voisins vers 21 h 25, mais personne n'a rien vu.",
          "Mme Fontaine était seule à la maison lorsque son mari s'est garé dans l'allée. Elle dit avoir entendu le coup de feu elle aussi, mais être d'abord sortie au lieu d'appeler. C'est alors qu'elle a trouvé son mari gisant dans l'allée, en sang.",
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
      {
        id: 'pecheurs',
        titre: "LES PECHEURS",
        histoire: [
          "Assis à l'ombre, l'inspecteur Lafouine profite des beaux jours pour s'offrir un après-midi de pêche. Près d'un tapis de nénuphars, il surveille avec attention le bouchon de sa ligne, espérant le voir bientôt plonger au fond de l'étang.",
          "De loin en loin, quelques pêcheurs rêvent, comme lui, de la prise extraordinaire.",
          "Lafouine s'apprête à sortir son pique-nique lorsqu'une centaine de policiers, munis de mitraillettes, font irruption et encerclent le plan d'eau. L'identité des personnes présentes est vérifiée.",
          "Après s'être fait connaître, le policier propose ses services. On lui apprend qu'un malfaiteur vient de braquer une banque et qu'une battue a été organisée. Traqué de tous côtés, l'homme s'est emparé d'une voiture appartenant à un représentant en matériel de pêche. Le véhicule a été retrouvé dans un chemin forestier à moins de cinq cents mètres de l'étang. On pense que le voleur se cache parmi les adeptes du moulinet.",
          "Tout le monde est rassemblé dans un champ près de l'étang. Chaque suspect explique ce qu'il faisait avant que la police ne vienne perturber cette paisible matinée.",
          "Cathy Mini, la seule femme du groupe, montre sa bourriche pleine de gardons : « Je suis arrivée à huit heures. Je voulais absolument ramener une friture à la maison. »",
          "Benny Diction, un adolescent des banlieues, présente les trois carpes qu'il a prises : « J'adore être ici, cela me change des bruits de la ville. »",
          "Phil Deferre n'a pas été très chanceux. Il exhibe son lancer et la cuiller où pendent deux magnifiques vers de terre : « Cela fait au moins trois heures que je suis là et je n'ai pris qu'un saumon. Il était tellement petit que j'ai préféré le remettre à l'eau. »",
          "Jean Aimar est très serré dans un survêtement visiblement trop petit pour lui : « Je suis tombé dans l'étang en voulant prendre mon épuisette. Comme je n'avais pas de tenue de rechange, j'ai pris le jogging que mon fils avait laissé dans le coffre de ma voiture. »",
          "Amédé Paon, un vieil homme, le dos courbé par les ans, sourit en montrant les six brochets qu'il a sortis de l'eau : « Vous êtes tous des amateurs à côté de moi. »",
          "Lafouine ne se laisse pas tromper. Il a vite fait d'indiquer aux policiers le faux pêcheur."          
        ],
        question: "Qui est le malfaiteur qui a braqué la banque ?",
      },
      {
        id: 'banque-mitraillee',
        titre: "BANQUE MITRAILLEE",
        histoire: [
          "Mercredi 15 juillet. Article paru dans le « Petit courrier » :",
          "Chasse-poursuite avec les motards, de notre envoyé spécial dépêché sur place",
          "Hier, vers 15h00, un individu masqué et fortement armé a tenté de pénétrer dans une agence du Crédit Avicole. Visiblement déçu de trouver portes closes, il a mitraillé la façade de la banque puis s'est enfui au volant d'une voiture volée.",
          "Pris en chasse par les motards, le bandit a terminé sa course dans un ravin après avoir fait plusieurs tonneaux. À leur arrivée, les policiers n'ont découvert qu'un véhicule vide. Des traces de sang, relevées sur les fauteuils, attestent que le conducteur a été blessé lors de l'accident.",
          "L'inspecteur Lafouine demande à Cartier de convoquer toutes les personnes qui se sont présentées aux urgences de l'hôpital, mardi en fin d'après-midi.",
          "Quelques heures plus tard, Lafouine se trouve en face de deux hommes et de trois femmes qui s'expliquent sur les raisons de leur présence dans le service de soins.",
          "Hubert de la Brûlette porte un plâtre au pied droit : « Je suis tombé dans l'escalier de mon château. Les radios ont révélé une fracture du péroné. »",
          "Jeanne Lacroix a le bras en écharpe : « En faisant mon jogging, j'ai glissé sur une crotte de chien. En voulant freiner ma chute, je me suis fait une luxation du coude. »",
          "Fuji Khaya est un touriste japonais. Une étudiante en langue orientale sert de traductrice : « Monsieur Khaya explique qu'il s'est profondément coupé la main en nettoyant son sabre de samouraï. On lui a fait deux points de suture. »",
          "Irène Juvin porte un énorme pansement sur le crâne : « Une ardoise du toit de ma maison s'est décrochée. Par malchance, je l'ai reçue sur le sommet de la tête. »",
          "Julie Leblond, une étudiante, se déplace avec des béquilles : « Je suis assez maladroite. En bricolant, je me suis entaillé la cuisse avec une lame de cutter. »"          
        ],
        question: "Qui a attaqué la banque ?",
      },
      {
        id: 'line-ossant',
        titre: "LINA OSSANT A DISPARU",
        histoire: [
          "La vedette de cinéma, Line Ossant, a disparu depuis trois jours de son domicile parisien. Sa secrétaire explique à l'inspecteur Lafouine leur dernière entrevue.",
          "« Vendredi matin, Line m'a annoncé qu'elle allait voir un de ses anciens époux pour régler un problème de pension alimentaire. Elle a précisé qu'avec ce milliardaire aussi avare qu'irascible, la discussion serait animée et qu'elle ne rentrerait que pour le déjeuner. Quand je lui ai rappelé qu'elle avait un autre rendez-vous dans la matinée, elle m'a demandé de l'annuler en ajoutant que le vendredi était le seul jour où son ex-mari ne jouait pas au golf. À dix heures précises, elle est montée dans sa voiture et depuis, je n'ai plus de nouvelles. »",
          "Au commissariat, Lafouine demande des informations sur les hommes qui ont partagé la vie de Line Ossant. Il apprend que l'actrice s'est mariée à cinq fois.",
          "En 1980, elle épouse en premières noces Sir Harold Winston. Leur union tient six mois. Line ne peut s'habituer au climat anglais. Aujourd'hui, Harold vit seul dans son immense château près de Londres.",
          "En 1983, le mariage entre Line et le mannequin Jean Vahit défraye la chronique. Ils vivent quatre ans sous le même toit. Lassé par les déplacements incessants de sa femme, Jean fait ses valises. Il habite maintenant un modeste appartement dans la banlieue parisienne.",
          "En avril 1988, la comédienne rencontre le Comte Édouard de la Branche et l'épouse quelques mois plus tard. Pendant deux ans, leur couple fait continuellement la Une des journaux. Édouard couvre sa femme de bijoux mais cela n'empêche pas celle-ci de demander le divorce. Peu affecté, le Comte continue depuis sa vie de dilettante aux bras des plus jolies femmes.",
          "En 1991, Line convole en quatrièmes noces avec Michel Platino, un ancien sportif reconverti dans les affaires. Leur liaison est très orageuse. Après trois mois, Line part en claquant la porte. Peu rancunier, Michel vit maintenant dans une maison située à quelques mètres de celle de l'actrice.",
          "Le dernier mariage en date semble plus intéressé qu'affectif. En 1995, la star accepte de partager la vie d'un riche armateur grec, Dino Papapoulos, âgé de 88 ans et grabataire depuis cinq ans. Se rendant rapidement compte de son erreur, Line préfère rompre quinze jours après la cérémonie."        
        ],
        question: "Qui est allée voir Line Ossant ?",
      },
      {
        id: 'inspecteur-blesse',
        titre: "UN INSPECTEUR DE POLICE BLESSE",
        histoire: [
          "Chaque matin, l'inspecteur Lafouine lit son journal avant d'aller travailler. Aujourd'hui, un titre barre la Une : « Un inspecteur de police blessé alors qu'il tentait d'arrêter un trafiquant de drogue ! »",
          "En lisant l'article qui suit, Lafouine apprend que son collègue, l'inspecteur Duval, a reçu six balles dans le corps. Transporté à l'hôpital dans un état sérieux, les chirurgiens indiquent qu'il est toujours dans le coma.",
          "Dès son arrivée au commissariat, Lafouine est convoqué dans le bureau de son patron. Très irrité, le commissaire Gradube lui dit :",
          "« Je veux absolument que l'on retrouve celui qui a osé tirer sur un de nos hommes. Vous allez reprendre tous les renseignements que Duval avait recueillis sur ce trafic de drogue. Je veux le coupable en prison avant deux jours. »",
          "L'inspecteur Duval était un solitaire. Au commissariat, aucun de ses collègues ne sait sur quelle piste il travaillait. Quand Lafouine se rend dans son bureau, la pièce est dans un désordre indescriptible.",
          "Depuis deux semaines, Duval avait interdit le ménage. De nombreux papiers sont agrafés au mur, des piles de dossiers s'entassent sur le bureau, la poubelle déborde. L'inspecteur se demande si 48 heures vont lui suffire pour faire le tri dans tout ce capharnaüm.",
          "Travaillant jour et nuit, Lafouine note pêle-mêle tout ce qui lui paraît intéressant :",
          "Le trafic de drogue est dirigé par un des quatre membres de la famille Winter.",
          "John W. dirige une entreprise de transports.",
          "Une livraison partira dimanche de l'entrepôt n° 4.",
          "Lucas W. est le patron d'une fabrique de chaussures.", 
          "L'aîné et le plus jeune des frères Winter sont honnêtes.",
          "Le chef de la bande sera seul. Il conduira le camion.",
          "Depuis la mort des parents Winter, John est devenu le chef de famille.",
          "Depuis cinq ans, Vincent W. aide son frère dans la gestion de son usine.",
          "La drogue est cachée dans des semelles de baskets.",
          "Lucas W. est en prison depuis six mois pour une affaire d'escroquerie.", 
          "Léon W. est majeur depuis 6 mois.",
          "Jeudi matin, en arrivant à son bureau, le commissaire Gradube retrouve le sourire. L'hôpital l'informe que Duval est sorti d'affaire et Lafouine a laissé un mot avant d'aller se coucher :",
          "« J'ai le nom du coupable. »"              
        ],
        question: "Quel homme a tiré sur l'inspecteur Duval ?",
      },
      {
        id: 'peintre-imposteur',
        titre: "UN PEINTRE IMPOSTEUR",
        histoire: [
          "Laure Hiculère, femme d'un célèbre peintre, demande à rencontrer l'inspecteur Lafouine. Très vite, elle explique la raison de sa venue :",
          "« Depuis quelques mois, je suis surprise par l'attitude de mon mari. Physiquement, il n'a pas changé, mais son comportement envers ses proches est différent. Il est plus nerveux, ne reconnaît plus ses amis et évite de rester seul avec moi. »",
          "— A-t-il consulté un médecin ? demande Lafouine.",
          "— Il ne veut pas en entendre parler, répond Laure. Il se met dans une colère noire quand j'aborde ce sujet et refuse tout examen.",
          "— Avez-vous remarqué autre chose ?",
          "— Il ne touche plus à ses pinceaux. Il va même jusqu'à dire qu'il souhaite abandonner la peinture. Je suis vraiment troublée car il m'avait toujours dit que c'était sa seule raison de vivre.",
          "— Que voulez-vous que je fasse ?",
          "— J'aimerais que vous assistiez à l'inauguration de la rétrospective que va lui consacrer le musée d'art moderne. Pour éviter qu'il se méfie, je vous ai apporté un badge de journaliste. Il pensera que vous venez l'interviewer.",
          "Le jour de l'inauguration, Lafouine se mêle à la foule des invités. Profitant d'un petit moment de calme, il réussit à engager la conversation avec le peintre.",
          "— Votre peinture est vraiment très lumineuse, vous devez avoir un secret ? demande l'inspecteur en sortant son petit carnet.",
          "Après avoir fixé un court moment son interlocuteur, le peintre se décide à lâcher quelques mots.", 
          "— Je travaille toujours en extérieur. Je ressens mieux les choses.",
          "— Mais, tout de même, comment faites-vous pour vous rapprocher si fidèlement des nuances naturelles ?",
          "— Je crois que je possède un don, répond l'artiste avec un petit air hautain. Vous savez, je n'utilise que du noir, du blanc et les couleurs primaires : rouge, jaune et orange. C'est un savant dosage qui me permet de réaliser ces teintes si particulières.",
          "Une équipe de télévision allemande vient interrompre la discussion. Lafouine est écarté alors qu'on emmène le peintre dans une autre salle.",
          "Profitant de ce mouvement de foule, Laure Hiculère vient se placer près du policier et lui demande discrètement son impression.",
          "— Je pense que l'homme avec qui je viens d'avoir une courte conversation n'est pas votre mari."             
        ],
        question: "Comment Lafouine sait-il que l'homme est un imposteur ?",
      },
      {
        id: 'corbeau',
        titre: "QUI EST LE CORBEAU ?",
        histoire: [
          "Teddy Sipet, président de « Fil et Tissu », une usine textile, vient au commissariat pour porter plainte. Il explique à l'inspecteur Lafouine que, depuis une semaine, il reçoit des menaces sur son téléphone portable.",
          "L'inconnu, qui a l'air de bien connaître sa vie privée, parle vite et prend soin de maquiller sa voix. Il s'adresse à Teddy en utilisant le surnom qu'on lui donnait lorsqu'il était enfant.",
          "« Mon numéro est sur liste rouge. Seuls les membres de ma famille et mes collaborateurs peuvent me joindre », explique l'industriel.",
          "Lafouine promet d'arrêter rapidement le « corbeau ». Pour cela, il convoque les personnes signalées par Teddy.",
          "Le premier à se présenter est son frère, Tony. L'entrevue est longue car l'homme est sujet au bégaiement. Plusieurs fois, il manque de s'étouffer en voulant prouver son innocence. Lafouine n'est pas mécontent de le voir partir car, à son contact, il commençait lui aussi à bafouiller !",
          "La seconde personne est la propre mère de Teddy. C'est elle qui lui a conseillé de porter plainte.",
          "« Il ne voulait pas, confie-t-elle. Je l'ai forcé car je ne supporte plus de le voir pâlir à chaque fois que l'affreux maître chanteur le contacte. »",
          "Vient ensuite Aldo, le directeur commercial de « Fil et Tissu ». Chargé des relations avec l'Italie, son français est très approximatif. Lafouine ne comprend pas tout ce que raconte cet homme né à Rome, juste après la guerre.",
          "Serge entre dans le bureau peu après Aldo. C'est le comptable de la société. Embauché depuis deux mois, il a déjà toute la confiance de son patron qui lui téléphone plusieurs fois par jour.",
          "Suzanne, la secrétaire personnelle de Teddy, est sa plus ancienne collaboratrice. Elle connaît tous les petits secrets de l'entreprise. Elle est une amie personnelle de la famille Sipet depuis plus de quarante ans.",
          "Lafouine doit se rendre à la clinique Saint-Adrien pour entendre Marianne, la femme de Teddy. Hospitalisée après une attaque cérébrale, elle a perdu en partie l'usage de la parole. Très en colère, elle reproche à son mari de ne pas s'occuper d'elle.", 
          "En sortant, Lafouine se rend dans les locaux de « Fil et Tissu » pour annoncer à son président que le coupable va bientôt devoir s'expliquer."      
        ],
        question: "Qui est le corbeau ?",
      }
    ],
  },
];

export const sectionParId = (id) => SECTIONS.find((s) => s.id === id);
export const casParId = (section, casId) => section?.cas?.find((c) => c.id === casId);