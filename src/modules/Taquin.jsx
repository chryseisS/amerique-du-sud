import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Images, RefreshCw, Play, Eye, EyeOff } from 'lucide-react';
import { db } from '../db';
import IMAGES from '../donnees/taquin.json';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « TAQUIN »
   ──────────────────────────────────────────────────────────────────
   • Images dans ../donnees/taquin.json (schéma : id, titre, image,
     cases). `cases` = nombre total de cases de la grille (9 → 3×3,
     16 → 4×4, 25 → 5×5…). DOIT être un carré parfait — le côté est
     déduit par racine carrée pour construire la grille.
   • Statut "complété" stocké dans Dexie (table `taquinFait`, clé = id
     de l'image). À ajouter au schéma db.js si absent :
       taquinFait: 'id, date'
   • Le filtre "nombre de cases" pilote à la fois le compteur affiché
     et le tirage aléatoire ; "Indifférent" = toutes tailles confondues.
   • Le tirage ne pioche que parmi les images pas encore faites pour
     le filtre choisi (cohérent avec "combien il en reste").
   ════════════════════════════════════════════════════════════════════ */

// ─── Logique du jeu (indépendante du rendu) ───────────────────────────
// Le plateau est un tableau de longueur n*n : plateau[position] = pièce
// affichée à cette position (0..n*n-2), ou -1 pour la case vide.

function coteDe(image) {
  return Math.round(Math.sqrt(image.cases));
}

function creerPlateauResolu(n) {
  const total = n * n;
  return Array.from({ length: total }, (_, i) => (i === total - 1 ? -1 : i));
}

function voisins(pos, n) {
  const ligne = Math.floor(pos / n);
  const col = pos % n;
  const liste = [];
  if (ligne > 0) liste.push(pos - n);
  if (ligne < n - 1) liste.push(pos + n);
  if (col > 0) liste.push(pos - 1);
  if (col < n - 1) liste.push(pos + 1);
  return liste;
}

// Mélange par coups valides successifs depuis l'état résolu : garantit
// que le puzzle reste toujours soluble (contrairement à une permutation
// aléatoire brute, qui a une chance sur deux d'être insoluble).
function melanger(n, coups = 200) {
  const plateau = creerPlateauResolu(n);
  let vide = plateau.indexOf(-1);
  let dernier = -1;
  for (let i = 0; i < coups; i++) {
    const options = voisins(vide, n).filter((p) => p !== dernier);
    const choix = options[Math.floor(Math.random() * options.length)];
    [plateau[vide], plateau[choix]] = [plateau[choix], plateau[vide]];
    dernier = vide;
    vide = choix;
  }
  return plateau;
}

function estResolu(plateau) {
  for (let i = 0; i < plateau.length - 1; i++) {
    if (plateau[i] !== i) return false;
  }
  return plateau[plateau.length - 1] === -1;
}

// ─── Petits composants réutilisés ──────────────────────────────────────
function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange}
            className="w-full bg-parchemin-carte border border-parchemin-bordure rounded-full px-3 py-1.5 text-[11.5px] text-encre-douce font-medium">
      {children}
    </select>
  );
}

function Entete({ sousTitre }) {
  return (
    <div className="relative px-5 pt-5 pb-1">
      <Link to="/jeux/mini-jeux" aria-label="Retour"
            className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
        <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
      </Link>
      <h1 className="font-serif uppercase tracking-[2px] text-[25px] text-encre font-semibold text-center -mt-6">Taquin</h1>
      <p className="text-center text-[12.5px] text-sepia mt-0.5">{sousTitre}</p>
    </div>
  );
}

export default function Taquin() {
  const [filtreCases, setFiltreCases] = useState('indifferent');
  const [mode, setMode] = useState('jeu'); // 'jeu' | 'revue'
  const [courante, setCourante] = useState(null);
  const [plateau, setPlateau] = useState([]);
  const [gagne, setGagne] = useState(false);
  const [apercu, setApercu] = useState(false);
  const [revueDetail, setRevueDetail] = useState(null);

  const faitesDB = useLiveQuery(() => db.taquinFait.toArray(), []) ?? [];
  const faitesIds = useMemo(() => new Set(faitesDB.map((f) => f.id)), [faitesDB]);

  const optionsCases = useMemo(
    () => [...new Set(IMAGES.map((im) => im.cases))].sort((a, b) => a - b),
    []
  );

  // Pool "contenu" = filtre nombre de cases (sert au compteur + à la galerie)
  const poolContenu = useMemo(
    () => IMAGES.filter((im) => filtreCases === 'indifferent' || im.cases === Number(filtreCases)),
    [filtreCases]
  );

  const total = poolContenu.length;
  const faites = poolContenu.filter((im) => faitesIds.has(im.id)).length;

  // Pool de tirage = images du filtre pas encore faites
  const poolTirage = useMemo(
    () => poolContenu.filter((im) => !faitesIds.has(im.id)),
    [poolContenu, faitesIds]
  );

  const imagesFaites = poolContenu.filter((im) => faitesIds.has(im.id));

  function majFiltre(valeur) {
    setFiltreCases(valeur);
    setCourante(null);
    setGagne(false);
    setApercu(false);
  }

  function lancer() {
    const candidats = poolTirage.filter((im) => im.id !== courante?.id);
    const source = candidats.length ? candidats : poolTirage;
    if (source.length === 0) return;
    const image = source[Math.floor(Math.random() * source.length)];
    setCourante(image);
    setPlateau(melanger(coteDe(image)));
    setGagne(false);
    setApercu(false);
  }

  async function deplacer(pos) {
    if (!courante || gagne) return;
    const n = coteDe(courante);
    const vide = plateau.indexOf(-1);
    if (!voisins(vide, n).includes(pos)) return;
    const nouveau = [...plateau];
    [nouveau[vide], nouveau[pos]] = [nouveau[pos], nouveau[vide]];
    setPlateau(nouveau);
    if (estResolu(nouveau)) {
      setGagne(true);
      await db.taquinFait.put({ id: courante.id, date: new Date().toISOString() });
    }
  }

  const messageVide = () => {
    if (total === 0) return "Aucune image ne correspond à ce nombre de cases.";
    return 'Toutes les images de ce filtre sont complétées ! Choisis un autre nombre de cases pour continuer.';
  };

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />
      <Entete sousTitre={mode === 'jeu' ? 'Choisis un nombre de cases, et lance-toi' : `${faites} image(s) complétée(s)`} />

      {/* Filtre */}
      <div className="relative px-5 pt-3">
        <Select value={filtreCases} onChange={(e) => majFiltre(e.target.value)}>
          <option value="indifferent">Nombre de cases : indifférent</option>
          {optionsCases.map((c) => <option key={c} value={c}>{c} cases</option>)}
        </Select>
      </div>

      {/* Compteur + bascule vers la galerie */}
      <div className="relative px-5 pt-4">
        <div className="flex items-center justify-between text-[12px] text-encre-douce mb-1.5">
          <span>{faites} / {total} images complétées</span>
          <button onClick={() => { setMode(mode === 'jeu' ? 'revue' : 'jeu'); setRevueDetail(null); }}
                  className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-sepia">
            {mode === 'jeu' ? <><Images className="w-3.5 h-3.5" strokeWidth={2} />Mes images</>
                            : <><ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />Retour au jeu</>}
          </button>
        </div>
        <div className="h-1.5 rounded-full bg-parchemin-bordure overflow-hidden">
          <div className="h-full bg-vert-cta rounded-full transition-all duration-300"
               style={{ width: total ? `${(faites / total) * 100}%` : '0%' }} />
        </div>
      </div>

      {/* Corps */}
      <div className="relative px-5 pt-5 pb-6">
        {mode === 'revue' ? (
          revueDetail ? (
            // Détail d'une image déjà complétée — pleine image, sans démarcation
            <div className="flex flex-col gap-3">
              <button onClick={() => setRevueDetail(null)}
                      className="self-start inline-flex items-center gap-1.5 text-[12px] font-semibold text-sepia">
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />Retour à la galerie
              </button>
              <div className="rounded-2xl overflow-hidden border border-parchemin-bordure shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
                <img src={revueDetail.image} alt={revueDetail.titre ?? ''} className="w-full h-auto block" />
              </div>
              {revueDetail.titre && (
                <p className="text-center font-serif text-[15px] text-encre">{revueDetail.titre}</p>
              )}
            </div>
          ) : (
            // Galerie des images complétées
            <div className="grid grid-cols-2 gap-3">
              {imagesFaites.map((im) => (
                <button key={im.id} onClick={() => setRevueDetail(im)}
                        className="relative aspect-square rounded-xl overflow-hidden border border-parchemin-bordure"
                        style={{ backgroundImage: `url('${im.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              ))}
              {imagesFaites.length === 0 && (
                <p className="col-span-2 text-center text-[12.5px] text-encre-douce/70 pt-6">
                  Aucune image complétée pour l'instant.
                </p>
              )}
            </div>
          )
        ) : !courante ? (
          poolTirage.length === 0 ? (
            <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
              <p className="text-[13px] text-encre-douce leading-snug">{messageVide()}</p>
            </div>
          ) : (
            <div className="flex justify-center pt-4">
              <button onClick={lancer}
                      className="inline-flex items-center gap-2 bg-vert-cta text-creme font-semibold text-[13.5px] rounded-full px-6 py-3.5 shadow-[0_8px_18px_rgba(35,64,52,0.35)]">
                <Play className="w-4 h-4" strokeWidth={2} fill="currentColor" />Lancer un taquin
              </button>
            </div>
          )
        ) : gagne ? (
          // Puzzle résolu — image complète, sans démarcation, avec le titre
          <div className="flex flex-col gap-3">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-parchemin-bordure shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
              <img src={courante.image} alt={courante.titre ?? ''} className="w-full h-full object-cover block" />
            </div>
            <div className="text-center">
              {courante.titre && <p className="font-serif text-[19px] text-encre font-semibold">{courante.titre}</p>}
              <p className="text-[12.5px] text-vert-cta font-semibold mt-0.5">Bravo, image complétée !</p>
            </div>
            <div className="flex justify-center pt-1">
              <button onClick={lancer}
                      className="inline-flex items-center gap-2 bg-vert-cta text-creme font-semibold text-[13px] rounded-full px-5 py-2.5">
                <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />Encore !
              </button>
            </div>
          </div>
        ) : (
          // Puzzle en cours
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-encre-douce">
                {courante.cases} cases{courante.titre ? ` — ${courante.titre}` : ''}
              </span>
              <button onClick={() => setApercu((a) => !a)}
                      className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-sepia">
                {apercu ? <><EyeOff className="w-3.5 h-3.5" strokeWidth={2} />Cacher</> : <><Eye className="w-3.5 h-3.5" strokeWidth={2} />Voir l'image</>}
              </button>
            </div>

            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-parchemin-bordure shadow-[0_4px_12px_rgba(60,40,20,0.12)] bg-[#5a4a36]">
              <div className="grid gap-[3px] w-full h-full"
                   style={{ gridTemplateColumns: `repeat(${coteDe(courante)}, 1fr)` }}>
                {plateau.map((piece, pos) => {
                  if (piece === -1) return <div key={pos} />;
                  const n = coteDe(courante);
                  const ligne = Math.floor(piece / n);
                  const col = piece % n;
                  const posX = n === 1 ? 0 : (col / (n - 1)) * 100;
                  const posY = n === 1 ? 0 : (ligne / (n - 1)) * 100;
                  return (
                    <button
                      key={pos}
                      onClick={() => deplacer(pos)}
                      aria-label={`Pièce ${piece + 1}`}
                      className="active:brightness-90"
                      style={{
                        backgroundImage: `url('${courante.image}')`,
                        backgroundSize: `${n * 100}% ${n * 100}%`,
                        backgroundPosition: `${posX}% ${posY}%`,
                      }}
                    />
                  );
                })}
              </div>

              {apercu && (
                <div className="absolute inset-0"
                     style={{ backgroundImage: `url('${courante.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              )}
            </div>

            <div className="flex justify-center pt-1">
              <button onClick={() => setCourante(null)} className="text-[12.5px] font-semibold text-sepia">
                Abandonner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}