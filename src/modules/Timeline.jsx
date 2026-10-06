import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Check, X, Play, RotateCcw, Trophy, Flag, Plus } from 'lucide-react';
import { db } from '../db';
import { DRAPEAUX } from '../donnees/constantes';
import CARTES from '../donnees/timeline.json';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « TIMELINE »  — route /jeux/mini-jeux/timeline
   ──────────────────────────────────────────────────────────────────
   • Cartes dans ../donnees/timeline.json. Schéma d'une carte :
       {
         id,            // unique
         titre,         // l'événement
         description,   // indice / contexte, affiché même année cachée
         annee,         // NOMBRE — négatif pour av. J.-C. (-1200)
         anneeTexte?,   // facultatif : texte affiché à la place de
                        // l'année une fois révélée ("vers 1450") —
                        // la comparaison se fait toujours sur `annee`
         difficulte,    // 1, 2 ou 3
         pays,          // "Pérou", "Chili"… (mêmes noms que PAYS dans
                        // constantes.js pour avoir le drapeau)
         image?         // facultatif : chemin depuis public/, ex.
                        // "/images/timeline/machu-picchu.webp" —
                        // affichée en carré (recadrée au centre si
                        // l'image n'est pas carrée)
       }
   • Niveaux : Facile = cartes 1 et 2 étoiles, Difficile = 3 étoiles.
   • Règles : une carte de départ est posée, année visible. Chaque carte
     tirée (année cachée) doit être placée au bon endroit de la frise.
     Bon placement → elle rejoint la frise, la série augmente. Mauvais
     placement → fin de partie. Égalité d'année avec une voisine =
     placement accepté des deux côtés.
   • Affichage : en haut la carte à placer, en dessous la frise qui
     défile de gauche à droite (petites cartes posées au-dessus de leur
     date). On touche un « + » entre deux dates pour choisir la place.
     Toucher une carte posée l'affiche en grand sous la frise.
   • Meilleure série enregistrée par niveau dans Dexie.
     À ajouter à db.js (NOUVELLE version, comme pour tabouFait) :
       timelineRecords: 'mode'
   ════════════════════════════════════════════════════════════════════ */

const MODES = [
  { cle: 'facile', libelle: 'Facile', filtre: (c) => c.difficulte === 1 || c.difficulte === 2 },
  { cle: 'difficile', libelle: 'Difficile', filtre: (c) => c.difficulte === 1 || c.difficulte === 2 || c.difficulte === 3 },
];

// Dimensions de la frise (≈ 4 dates visibles sur un téléphone)
const L_CARTE = 'w-[90px]';
const L_ESPACE = 'w-[22px]';
const H_CARTE = 'h-[124px]';

function melanger(liste) {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

function formaterAnnee(carte) {
  if (carte.anneeTexte) return carte.anneeTexte;
  return carte.annee < 0 ? `${-carte.annee} av. J.-C.` : String(carte.annee);
}

// La position `g` = l'espace juste avant frise[g] (g = frise.length : après la dernière).
function estBienPlacee(frise, g, carte) {
  const avant = g === 0 || frise[g - 1].annee <= carte.annee;
  const apres = g === frise.length || carte.annee <= frise[g].annee;
  return avant && apres;
}

function positionCorrecte(frise, carte) {
  const i = frise.findIndex((f) => f.annee > carte.annee);
  return i === -1 ? frise.length : i;
}

function insererTrie(frise, carte) {
  const g = positionCorrecte(frise, carte);
  return [...frise.slice(0, g), carte, ...frise.slice(g)];
}

// ─── COMPOSANTS ───────────────────────────────────────────────────────

function Entete() {
  return (
    <div className="relative px-5 pt-5 pb-1">
      <Link to="/jeux/mini-jeux" aria-label="Retour"
            className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
        <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
      </Link>
      <h1 className="font-serif uppercase tracking-[2px] text-[25px] text-encre font-semibold text-center -mt-6">Timeline</h1>
      <p className="text-center text-[12.5px] text-sepia mt-0.5">Replace chaque événement sur la frise</p>
    </div>
  );
}

function Drapeaux({ pays, petit }) {
  if (!pays) return null;
  const liste = [].concat(pays);
  return (
    <span className={`inline-flex items-center flex-wrap gap-x-1.5 ${petit ? 'text-[9px]' : 'text-[11px]'} text-encre-douce`}>
      {liste.map((p) => (
        <span key={p} className="inline-flex items-center gap-1">
          {DRAPEAUX?.[p] && (
            <img src={DRAPEAUX[p]} alt="" className={`${petit ? 'w-3 h-2' : 'w-4 h-3'} object-cover rounded-[2px]`} />
          )}
          {!petit && p}
        </span>
      ))}
    </span>
  );
}

function Etoiles({ n }) {
  if (!n) return null;
  return <span className="text-[11px] text-sepia">{'★'.repeat(n)}{'☆'.repeat(Math.max(0, 3 - n))}</span>;
}

// Carte au format « carte à jouer » : titre, image carrée, description.
// Sert pour la carte à placer (année cachée / révélée en rouge après une
// erreur) et pour le détail d'une carte posée (année visible).
function CarteJeu({ carte, annee = 'cachee', onFermer, pointilles }) {
  const cadre = annee === 'erreur'
    ? 'border-2 border-terra-500'
    : pointilles ? 'border-2 border-dashed border-jeu-minijeux' : 'border border-parchemin-bordure';
  return (
    <div className={`relative w-[210px] mx-auto bg-parchemin-carte rounded-2xl px-3.5 pt-3.5 pb-3 text-center shadow-[0_6px_16px_rgba(60,40,20,0.18)] ${cadre}`}>
      {onFermer && (
        <button onClick={onFermer} aria-label="Fermer le détail"
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-encre-douce bg-[rgba(255,250,235,0.8)]">
          <X className="w-4 h-4" strokeWidth={2.2} />
        </button>
      )}
      <p lang="fr" className={`font-serif text-[15.5px] text-encre font-semibold leading-snug hyphens-auto break-words ${onFermer ? 'px-5' : ''}`}>
        {carte.titre}
      </p>
      {carte.image && (
        <img src={carte.image} alt="" className="w-full aspect-square object-cover rounded-xl mt-2.5 border border-parchemin-bordure" />
      )}
      {carte.description && (
        <p className="text-[12px] text-encre-douce leading-snug mt-2.5">{carte.description}</p>
      )}
      <div className="flex items-center justify-center gap-2 mt-2.5">
        <Drapeaux pays={carte.pays} />
        <Etoiles n={carte.difficulte} />
      </div>
      {annee !== 'cachee' && (
        <p className={`font-serif text-[22px] font-bold leading-none mt-2.5 ${annee === 'erreur' ? 'text-terra-500' : 'text-encre'}`}>
          {formaterAnnee(carte)}
        </p>
      )}
    </div>
  );
}

// Une colonne de la frise : petite carte au-dessus, point sur la ligne, date en dessous
function ColonneCarte({ carte, style = 'posee', surligner, ouverte, onOuvrir }) {
  const cadre = {
    posee: 'bg-parchemin-carte border border-parchemin-bordure',
    erreur: 'bg-terra-500/10 border-2 border-terra-500',
    fantome: 'bg-jeu-minijeux/10 border-2 border-dashed border-jeu-minijeux',
  }[style];
  const couleurDate = style === 'erreur' ? 'text-terra-500' : style === 'fantome' ? 'text-jeu-minijeux' : 'text-encre';
  const point = style === 'erreur' ? 'bg-terra-500' : style === 'fantome' ? 'bg-jeu-minijeux' : 'bg-encre';

  return (
    <div className={`${L_CARTE} shrink-0 flex flex-col`}>
      {style === 'fantome' ? (
        <div className={`${H_CARTE} rounded-xl ${cadre}`} />
      ) : (
        <button type="button" onClick={onOuvrir}
                className={`${H_CARTE} w-full text-center rounded-xl overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(60,40,20,0.10)] transition-shadow duration-500 active:scale-[0.97] ${cadre} ${surligner ? 'ring-2 ring-vert-cta' : ''} ${ouverte ? 'ring-2 ring-jeu-minijeux' : ''}`}>
          <div className="flex-1 min-h-0 px-1.5 py-2 flex flex-col items-center justify-center gap-1.5 text-center">
            <p lang="fr"
               className="font-serif text-[11px] text-encre font-semibold leading-[1.25] hyphens-auto break-words overflow-hidden line-clamp-6">
              {carte.titre}
            </p>
            <Drapeaux pays={carte.pays} petit />
          </div>
        </button>
      )}
      {/* ligne + point */}
      <div className="relative h-6 flex items-center justify-center">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-sepia/50" />
        <div className={`relative w-2.5 h-2.5 rounded-full ${point}`} />
      </div>
      <p className={`text-center font-serif text-[12px] font-bold leading-tight ${couleurDate}`}>
        {style === 'fantome' ? '\u00a0' : formaterAnnee(carte)}
      </p>
    </div>
  );
}

// Un espace entre deux dates : un « + » sur la ligne (ou ✗ / ✓ en fin de partie)
function Espace({ onChoisir, marque }) {
  const styleMarque = {
    erreur: 'bg-terra-500 text-creme border-terra-500',
  }[marque] ?? 'bg-parchemin-carte text-jeu-minijeux border-jeu-minijeux/60';

  return (
    <div className={`${L_ESPACE} shrink-0 flex flex-col`}>
      <div className={H_CARTE} />
      <div className="relative h-6 flex items-center justify-center">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-sepia/50" />
        {(onChoisir || marque) && (
          <button type="button" onClick={onChoisir} disabled={!onChoisir}
                  aria-label="Placer ici"
                  className={`relative w-[22px] h-[22px] rounded-full border flex items-center justify-center active:scale-90 transition-transform ${styleMarque}`}>
            {marque === 'erreur'
              ? <X className="w-3 h-3" strokeWidth={3} />
              : <Plus className="w-3.5 h-3.5" strokeWidth={2.6} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Frise({ frise, position, onChoisir, erreur, carteErreur, surligneId, ouverteId, onOuvrir }) {
  const conteneur = useRef(null);
  const cible = useRef(null);

  // Garde la position choisie (ou la carte révélée / la dernière posée) au centre
  useEffect(() => {
    const c = conteneur.current;
    const el = cible.current;
    if (!c || !el) return;
    c.scrollTo({ left: el.offsetLeft - c.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' });
  }, [position, frise.length, erreur, surligneId]);

  const colonnes = [];
  for (let g = 0; g <= frise.length; g++) {
    if (erreur && g === erreur.juste) {
      colonnes.push(
        <div key="erreur" ref={cible}>
          <ColonneCarte carte={carteErreur} style="erreur"
                        ouverte={ouverteId === carteErreur.id} onOuvrir={() => onOuvrir(carteErreur)} />
        </div>
      );
    }
    if (!erreur && g === position) {
      colonnes.push(
        <div key={`f${g}`} ref={cible} className="flex">
          <Espace />
          <ColonneCarte style="fantome" />
          <Espace />
        </div>
      );
    } else {
      colonnes.push(
        <Espace key={`e${g}`}
                onChoisir={onChoisir ? () => onChoisir(g) : undefined}
                marque={erreur && g === erreur.choisie ? 'erreur' : undefined} />
      );
    }
    if (g < frise.length) {
      const c = frise[g];
      colonnes.push(
        <div key={c.id} ref={!erreur && position === null && c.id === surligneId ? cible : undefined}>
          <ColonneCarte carte={c} surligner={c.id === surligneId}
                        ouverte={ouverteId === c.id} onOuvrir={() => onOuvrir(c)} />
        </div>
      );
    }
  }

  return (
    <div ref={conteneur} className="relative overflow-x-auto scrollbar-hide px-4">
      <div className="flex w-max pb-1">{colonnes}</div>
    </div>
  );
}

// ─── ÉCRAN PRINCIPAL ──────────────────────────────────────────────────

export default function Timeline() {
  const [phase, setPhase] = useState('accueil'); // accueil | jeu | erreur | parfait
  const [mode, setMode] = useState('facile');
  const [paquet, setPaquet] = useState([]);
  const [frise, setFrise] = useState([]);
  const [courante, setCourante] = useState(null);
  const [position, setPosition] = useState(null); // null = pas encore choisie
  const [serie, setSerie] = useState(0);
  const [dernier, setDernier] = useState(null);   // dernière carte bien placée
  const [erreur, setErreur] = useState(null);     // { choisie, juste }
  const [recordAvant, setRecordAvant] = useState(0);
  const [detail, setDetail] = useState(null);     // carte posée ouverte en grand
  const refDetail = useRef(null);

  // Amène le détail à l'écran quand on touche une carte de la frise
  useEffect(() => {
    if (detail) refDetail.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [detail]);

  const recordsDB = useLiveQuery(() => db.timelineRecords.toArray(), []) ?? [];
  const record = recordsDB.find((r) => r.mode === mode)?.serie ?? 0;

  const modeActif = MODES.find((m) => m.cle === mode);
  const pool = useMemo(() => CARTES.filter(modeActif.filtre), [modeActif]);

  // Le surlignage "bien placé" disparaît tout seul
  useEffect(() => {
    if (!dernier) return;
    const t = setTimeout(() => setDernier(null), 2500);
    return () => clearTimeout(t);
  }, [dernier]);

  function commencer() {
    if (pool.length < 2) return;
    const [depart, premiere, ...reste] = melanger(pool);
    setFrise([depart]);
    setCourante(premiere);
    setPaquet(reste);
    setPosition(null);
    setSerie(0);
    setDernier(null);
    setErreur(null);
    setRecordAvant(record);
    setDetail(null);
    setPhase('jeu');
  }

  function enregistrerRecord(serieFinale) {
    if (serieFinale <= record) return;
    try {
      db.timelineRecords.put({ mode, serie: serieFinale, date: new Date().toISOString() })
        .catch((err) => console.error('Erreur en enregistrant le record Timeline :', err));
    } catch (err) {
      console.error('Erreur en enregistrant le record Timeline :', err);
    }
  }

  function placer() {
    if (!courante || position === null) return;

    if (!estBienPlacee(frise, position, courante)) {
      setErreur({ choisie: position, juste: positionCorrecte(frise, courante) });
      setPhase('erreur');
      enregistrerRecord(serie);
      return;
    }

    const nouvelleFrise = insererTrie(frise, courante);
    const nouvelleSerie = serie + 1;
    setFrise(nouvelleFrise);
    setSerie(nouvelleSerie);
    setDernier(courante);
    setPosition(null);

    if (paquet.length === 0) {
      setCourante(null);
      setPhase('parfait');
      enregistrerRecord(nouvelleSerie);
      return;
    }

    const [suivante, ...reste] = paquet;
    setCourante(suivante);
    setPaquet(reste);
  }

  function menu() {
    setPhase('accueil');
    setCourante(null);
    setErreur(null);
  }

  // ─── ACCUEIL ───
  if (phase === 'accueil') {
    return (
      <div className="fond-carte relative min-h-full overflow-hidden">
        <div className="vignette-carte" aria-hidden="true" />
        <Entete />

        <div className="relative px-5 pt-5 pb-8 flex flex-col gap-4">
          <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
            <p className="font-serif text-[15px] text-encre font-semibold mb-2">Règles</p>
            <p className="text-[12.5px] text-encre-douce leading-relaxed">
              Une première carte est posée, année visible. Chaque nouvelle carte arrive
              année cachée : choisis sa place sur la frise, puis valide.
              Bien placée, elle rejoint la frise. Mal placée, la partie s'arrête.
              Jusqu'où iras-tu ?
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-sepia font-semibold mb-2">Niveau</p>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => {
                const nb = CARTES.filter(m.filtre).length;
                const actif = m.cle === mode;
                return (
                  <button key={m.cle} onClick={() => setMode(m.cle)}
                          className={actif
                            ? 'py-2.5 rounded-2xl text-[13px] font-semibold bg-jeu-minijeux text-creme border border-jeu-minijeux'
                            : 'py-2.5 rounded-2xl text-[13px] font-semibold bg-parchemin-carte text-encre-douce border border-parchemin-bordure'}>
                    {m.libelle}
                    <span className="block text-[10.5px] font-normal opacity-75">{nb} carte{nb > 1 ? 's' : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[13px] text-encre-douce">
            <Trophy className="w-4 h-4 text-jeu-minijeux" strokeWidth={2} />
            Meilleure série : <span className="font-semibold text-encre">{record}</span>
          </div>

          <div className="flex justify-center">
            {pool.length < 2 ? (
              <p className="text-[12.5px] text-encre-douce text-center">
                Il faut au moins 2 cartes dans ce niveau pour jouer — ajoute des cartes dans timeline.json.
              </p>
            ) : (
              <button onClick={commencer}
                      className="inline-flex items-center gap-2 bg-vert-cta text-creme font-semibold text-[13.5px] rounded-full px-6 py-3.5 shadow-[0_8px_18px_rgba(35,64,52,0.35)]">
                <Play className="w-4 h-4" strokeWidth={2} fill="currentColor" />Commencer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── JEU / ERREUR / PARFAIT ───
  const enJeu = phase === 'jeu';

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />
      <Entete />

      {/* Série / record / abandon */}
      <div className="relative px-5 pt-3 flex items-center justify-between text-[12px] text-encre-douce">
        <span>Série : <span className="font-semibold text-encre">{serie}</span></span>
        <span className="inline-flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5 text-jeu-minijeux" strokeWidth={2} />{record}
        </span>
        {enJeu ? (
          <button onClick={menu} className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-sepia">
            <Flag className="w-3.5 h-3.5" strokeWidth={2} />Abandonner
          </button>
        ) : <span className="text-[11px]">{frise.length} / {pool.length} cartes</span>}
      </div>

      {/* Carte à placer / message de fin */}
      <div className="relative px-5 pt-4">
        {phase === 'parfait' ? (
          <div className="bg-vert-cta/10 border border-vert-cta/40 rounded-2xl px-4 py-4 text-center">
            <p className="font-serif text-[17px] text-vert-cta font-semibold">Frise parfaite !</p>
            <p className="text-[12.5px] text-encre-douce mt-0.5">
              Toutes les cartes sont placées sans erreur — série de {serie}.
              {serie > recordAvant ? ' Nouveau record !' : ''}
            </p>
          </div>
        ) : (
          <>
            <p className="font-serif text-[15px] text-encre font-semibold text-center mb-2.5">
              {phase === 'erreur' ? 'Raté ! Voici sa vraie place' : 'Où se place cet évènement ?'}
            </p>
            <CarteJeu carte={courante} annee={phase === 'erreur' ? 'erreur' : 'cachee'} pointilles />
            {phase === 'erreur' && (
              <p className="text-[12.5px] text-encre-douce text-center mt-2">
                Série finale : <span className="font-semibold text-encre">{serie}</span>
                {serie > recordAvant ? ' — nouveau record !' : ''}
              </p>
            )}
          </>
        )}
      </div>

      {/* Frise */}
      <div className="relative pt-5">
        <Frise frise={frise}
               position={enJeu ? position : null}
               onChoisir={enJeu ? setPosition : undefined}
               erreur={phase === 'erreur' ? erreur : null}
               carteErreur={courante}
               surligneId={dernier?.id}
               ouverteId={detail?.id}
               onOuvrir={(c) => setDetail((d) => (d?.id === c.id ? null : c))} />
        <p className="text-[10.5px] text-sepia text-center mt-1.5">
          ← fais défiler la frise →
        </p>
      </div>

      {/* Détail d'une carte touchée */}
      {detail && (
        <div ref={refDetail} className="relative px-5 pt-3 scroll-mb-4">
          <CarteJeu carte={detail} annee="visible" onFermer={() => setDetail(null)} />
        </div>
      )}

      {/* Actions */}
      <div className="relative px-5 pt-3 pb-6">
        {enJeu ? (
          <button onClick={placer} disabled={position === null}
                  className="w-full inline-flex items-center justify-center gap-2 bg-vert-cta text-creme font-semibold text-[13.5px] rounded-full py-3 shadow-[0_8px_18px_rgba(35,64,52,0.30)] disabled:opacity-40 disabled:shadow-none active:scale-95 transition-transform">
            <Check className="w-4 h-4" strokeWidth={2.5} />
            {position === null ? 'Touche un + sur la frise' : 'Placer ici'}
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={commencer}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-vert-cta text-creme font-semibold text-[12.5px] rounded-full py-2.5">
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.2} />Rejouer
            </button>
            <button onClick={menu}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-parchemin-carte border border-parchemin-bordure text-encre-douce font-semibold text-[12.5px] rounded-full py-2.5">
              <X className="w-3.5 h-3.5" strokeWidth={2.2} />Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}