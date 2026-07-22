import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, History, RefreshCw, Play, Search, X } from 'lucide-react';
import { db } from '../db';
import QUESTIONS from '../donnees/quiz.json';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « QUIZ »
   ──────────────────────────────────────────────────────────────────
   • Contenu des questions dans ../donnees/quiz.json (schéma :
     id, pays, theme, difficulte, type ('vf'|'qcm'|'2v1f'), question,
     choix? (array, uniquement pour qcm),
     affirmations? (array de 3 strings, uniquement pour 2v1f),
     reponse (texte attendu : 'Vrai'/'Faux', le bon choix qcm, ou
     l'affirmation fausse pour 2v1f), explication)
   • Statut "lu" stocké dans Dexie (table `quizLu`, clé = id de question).
     À ajouter au schéma db.js si absent :  quizLu: 'id, date'
   • Adapte l'import `from '../db'` si ton fichier Dexie a un autre nom.
   ════════════════════════════════════════════════════════════════════ */

// ─── Couleurs des badges (thème / difficulté) ─────────────────────────
const COULEURS_THEME = {
  Histoire:   { bg: 'bg-terra-500/12', text: 'text-terra-700' },
  Culture:    { bg: 'bg-[#9a5b8c]/12', text: 'text-[#7a4570]' },
  Géographie: { bg: 'bg-[#3a7ca5]/12', text: 'text-[#2c5f80]' },
  Faune:      { bg: 'bg-[#2f8f7f]/12', text: 'text-[#226358]' },
};
const COULEURS_DIFFICULTE = {
  facile:    { bg: 'bg-[#5e8c4a]/12', text: 'text-[#3f6132]' },
  moyen:     { bg: 'bg-[#d4872a]/12', text: 'text-[#93591b]' },
  difficile: { bg: 'bg-terra-500/12', text: 'text-terra-700' },
};
const NEUTRE = { bg: 'bg-sepia/12', text: 'text-sepia' };
const themeBadge = (t) => COULEURS_THEME[t] ?? NEUTRE;
const diffBadge  = (d) => COULEURS_DIFFICULTE[d] ?? NEUTRE;

// Libellé affiché devant courante.reponse au verso, selon le type de question
const LIBELLE_REPONSE = { vf: 'Réponse', qcm: 'Réponse', '2v1f': "L'affirmation fausse était" };

const normaliser = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function Badge({ className, children }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${className}`}>
      {children}
    </span>
  );
}

function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange}
            className="w-full bg-parchemin-carte border border-parchemin-bordure rounded-full px-3 py-1.5 text-[11.5px] text-encre-douce font-medium">
      {children}
    </select>
  );
}

// ─── En-tête réutilisé ────────────────────────────────────────────────
function Entete({ sousTitre }) {
  return (
    <div className="relative px-5 pt-5 pb-1">
      <Link to="/jeux" aria-label="Retour"
            className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
        <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
      </Link>
      <h1 className="font-serif uppercase tracking-[2px] text-[25px] text-encre font-semibold text-center -mt-6">Quiz</h1>
      <p className="text-center text-[12.5px] text-sepia mt-0.5">{sousTitre}</p>
    </div>
  );
}

// ─── Carte-réponse (verso seul), réutilisée en revue ──────────────────
function CarteReponse({ q, reponseChoisie }) {
  const bt = themeBadge(q.theme);
  const correct = reponseChoisie == null || reponseChoisie === q.reponse;
  return (
    <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)] flex flex-col gap-3">
      <div className="flex gap-1.5">
        <Badge className={`${bt.bg} ${bt.text}`}>{q.theme}</Badge>
        {reponseChoisie != null && (
          <Badge className={correct ? 'bg-vert-cta/15 text-vert-cta' : 'bg-terra-500/15 text-terra-700'}>
            {correct ? 'Bonne réponse' : 'Raté'}
          </Badge>
        )}
      </div>
      <p className="text-[14px] font-medium text-encre leading-relaxed">{q.question}</p>
      {reponseChoisie != null && (
        <p className="text-[12.5px] text-encre-douce">Ta réponse : {reponseChoisie}</p>
      )}
      <p className="text-[15px] font-semibold text-encre">Réponse : {q.reponse}</p>
      <p className="text-[13px] text-encre-douce leading-relaxed whitespace-pre-line">{q.explication}</p>
    </div>
  );
}

export default function Quiz() {
  const [filtres, setFiltres] = useState({ pays: 'tous', theme: 'tous', difficulte: 'tous', type: 'tous', statut: 'non-lues' });
  const [mode, setMode] = useState('jeu');        // 'jeu' | 'revue'
  const [courante, setCourante] = useState(null);
  const [retournee, setRetournee] = useState(false);
  const [reponseChoisie, setReponseChoisie] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [revueDetail, setRevueDetail] = useState(null);

  const lues = useLiveQuery(() => db.quizLu.toArray(), []) ?? [];
  const luesIds = useMemo(() => new Set(lues.map((l) => l.id)), [lues]);

  const optionsFiltres = useMemo(() => ({
    pays: [...new Set(QUESTIONS.map((q) => q.pays))].sort(),
    theme: [...new Set(QUESTIONS.map((q) => q.theme))].sort(),
  }), []);

  // Pool "contenu" = filtres thématiques uniquement (sert au compteur + à la revue)
  const poolContenu = useMemo(() => QUESTIONS.filter((q) =>
    (filtres.pays === 'tous' || q.pays === filtres.pays) &&
    (filtres.theme === 'tous' || q.theme === filtres.theme) &&
    (filtres.difficulte === 'tous' || q.difficulte === filtres.difficulte) &&
    (filtres.type === 'tous' || q.type === filtres.type)
  ), [filtres.pays, filtres.theme, filtres.difficulte, filtres.type]);

  const total = poolContenu.length;
  const faites = poolContenu.filter((q) => luesIds.has(q.id)).length;

  // Pool de tirage = pool contenu + filtre statut (Option A : le statut pilote le tirage)
  const poolTirage = useMemo(() => poolContenu.filter((q) => {
    if (filtres.statut === 'non-lues')  return !luesIds.has(q.id);
    if (filtres.statut === 'deja-lues') return luesIds.has(q.id);
    return true;
  }), [poolContenu, filtres.statut, luesIds]);

  function majFiltre(cle, valeur) {
    setFiltres((f) => ({ ...f, [cle]: valeur }));
    setCourante(null);
    setRetournee(false);
    setReponseChoisie(null);
  }

  function lancer() {
    const candidats = poolTirage.filter((q) => q.id !== courante?.id);
    const source = candidats.length ? candidats : poolTirage;
    if (source.length === 0) return;
    setCourante(source[Math.floor(Math.random() * source.length)]);
    setRetournee(false);
    setReponseChoisie(null);
  }

  // « Encore ! » : on retourne la carte d'abord, puis on échange la question
  // à mi-parcours (carte de profil) pour éviter tout flash de contenu.
  function suivante() {
    const candidats = poolTirage.filter((q) => q.id !== courante?.id);
    const source = candidats.length ? candidats : poolTirage;
    if (source.length === 0) return;
    const prochaine = source[Math.floor(Math.random() * source.length)];
    setRetournee(false);
    setTimeout(() => {
      setCourante(prochaine);
      setReponseChoisie(null);
    }, 250); // = moitié de la transition (duration-500)
  }

  async function repondre(choix) {
    setReponseChoisie(choix);
    setRetournee(true);
    await db.quizLu.put({ id: courante.id, date: new Date().toISOString() });
  }

  async function reinitialiserFiltre() {
    await db.quizLu.bulkDelete(poolContenu.map((q) => q.id));
    setCourante(null);
  }

  const messageVide = () => {
    if (total === 0) return "Aucune question ne correspond à ces filtres.";
    if (filtres.statut === 'deja-lues') return "Aucune question déjà répondue ici. Réponds-en quelques-unes d'abord.";
    return "Toutes les questions de ce filtre ont été répondues ! Passe le statut sur « déjà lues » pour réviser, ou réinitialise.";
  };

  const bt = themeBadge(courante?.theme);
  const bd = diffBadge(courante?.difficulte);

  // Liste de revue filtrée par recherche
  const listeRevue = poolContenu
    .filter((q) => luesIds.has(q.id))
    .filter((q) => {
      if (!recherche.trim()) return true;
      const cible = normaliser(`${q.question} ${q.reponse} ${q.theme} ${q.pays}`);
      return normaliser(recherche).split(/\s+/).every((mot) => cible.includes(mot));
    });

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />
      <Entete sousTitre={mode === 'jeu' ? 'Choisis un thème, ou lance-toi' : `${faites} question(s) répondue(s)`} />

      {/* Filtres — grille 2 colonnes, tout visible sans scroll */}
      <div className="relative px-5 pt-3 grid grid-cols-2 gap-2">
        <Select value={filtres.pays} onChange={(e) => majFiltre('pays', e.target.value)}>
          <option value="tous">Pays : tous</option>
          {optionsFiltres.pays.map((p) => <option key={p} value={p}>{p}</option>)}
        </Select>
        <Select value={filtres.theme} onChange={(e) => majFiltre('theme', e.target.value)}>
          <option value="tous">Thème : tous</option>
          {optionsFiltres.theme.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Select value={filtres.difficulte} onChange={(e) => majFiltre('difficulte', e.target.value)}>
          <option value="tous">Difficulté : toutes</option>
          <option value="facile">Facile</option>
          <option value="moyen">Moyen</option>
          <option value="difficile">Difficile</option>
        </Select>
        <Select value={filtres.type} onChange={(e) => majFiltre('type', e.target.value)}>
          <option value="tous">Type : tous</option>
          <option value="vf">Vrai / Faux</option>
          <option value="qcm">QCM</option>
          <option value="2v1f">2 Vraies 1 Fausse</option>
        </Select>
        <Select value={filtres.statut} onChange={(e) => majFiltre('statut', e.target.value)}>
          <option value="toutes">Statut : toutes</option>
          <option value="non-lues">Jamais lues</option>
          <option value="deja-lues">Déjà lues</option>
        </Select>
      </div>

      {/* Compteur + bascule vers la revue */}
      <div className="relative px-5 pt-4">
        <div className="flex items-center justify-between text-[12px] text-encre-douce mb-1.5">
          <span>{faites} / {total} questions faites</span>
          <button onClick={() => { setMode(mode === 'jeu' ? 'revue' : 'jeu'); setRevueDetail(null); }}
                  className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-sepia">
            {mode === 'jeu' ? <><History className="w-3.5 h-3.5" strokeWidth={2} />Mes réponses</>
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
            // Détail d'une question déjà lue
            <div className="flex flex-col gap-3">
              <button onClick={() => setRevueDetail(null)}
                      className="self-start inline-flex items-center gap-1.5 text-[12px] font-semibold text-sepia">
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />Retour à la liste
              </button>
              <CarteReponse q={revueDetail} reponseChoisie={null} />
            </div>
          ) : (
            // Liste + recherche
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 bg-parchemin-carte border border-parchemin-bordure rounded-full px-3.5 py-2">
                <Search className="w-4 h-4 text-sepia shrink-0" strokeWidth={2} />
                <input value={recherche} onChange={(e) => setRecherche(e.target.value)}
                       placeholder="Rechercher un mot-clé…"
                       className="flex-1 min-w-0 bg-transparent text-[13px] text-encre placeholder:text-encre-douce/60 outline-none" />
                {recherche && (
                  <button onClick={() => setRecherche('')} aria-label="Effacer">
                    <X className="w-4 h-4 text-sepia" strokeWidth={2} />
                  </button>
                )}
              </div>

              {listeRevue.map((q) => (
                <button key={q.id} onClick={() => setRevueDetail(q)}
                        className="text-left bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-4 shadow-[0_4px_12px_rgba(60,40,20,0.10)]">
                  <div className="flex gap-1.5 mb-2">
                    <Badge className={`${themeBadge(q.theme).bg} ${themeBadge(q.theme).text}`}>{q.theme}</Badge>
                    <Badge className={`${diffBadge(q.difficulte).bg} ${diffBadge(q.difficulte).text}`}>{q.difficulte}</Badge>
                  </div>
                  <p className="text-[13.5px] font-medium text-encre leading-snug">{q.question}</p>
                </button>
              ))}

              {listeRevue.length === 0 && (
                <p className="text-center text-[12.5px] text-encre-douce/70 pt-6">
                  {faites === 0 ? "Aucune question répondue pour ces filtres pour l'instant."
                                : "Aucun résultat pour cette recherche."}
                </p>
              )}
            </div>
          )
        ) : !courante ? (
          poolTirage.length === 0 ? (
            <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
              <p className="text-[13px] text-encre-douce leading-snug mb-4">{messageVide()}</p>
              {total > 0 && faites > 0 && (
                <button onClick={reinitialiserFiltre}
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-sepia">
                  <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />Réinitialiser ce filtre
                </button>
              )}
            </div>
          ) : (
            <div className="flex justify-center pt-4">
              <button onClick={lancer}
                      className="inline-flex items-center gap-2 bg-vert-cta text-creme font-semibold text-[13.5px] rounded-full px-6 py-3.5 shadow-[0_8px_18px_rgba(35,64,52,0.35)]">
                <Play className="w-4 h-4" strokeWidth={2} fill="currentColor" />Lancer une question
              </button>
            </div>
          )
        ) : (
          // Carte qui se retourne — les 2 faces empilées en grille → hauteur = plus grande face
          <div className="[perspective:1200px]">
            <div className="grid items-start transition-transform duration-500 ease-linear [transform-style:preserve-3d]"
                 style={{ transform: retournee ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

              {/* Recto : question */}
              <div className="[grid-area:1/1] [backface-visibility:hidden] max-h-[65vh] overflow-y-auto scroll-discret bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)] flex flex-col gap-3.5">
                <div className="flex gap-1.5">
                  <Badge className={`${bt.bg} ${bt.text}`}>{courante.theme}</Badge>
                  <Badge className={`${bd.bg} ${bd.text}`}>{courante.difficulte}</Badge>
                </div>
                <p className="text-[15px] font-medium text-encre leading-relaxed">{courante.question}</p>
                {courante.type === 'qcm' ? (
                  <div className="flex flex-col gap-2">
                    {courante.choix.map((c) => (
                      <button key={c} onClick={() => repondre(c)}
                              className="text-left text-[13px] text-encre bg-creme/60 border border-parchemin-bordure rounded-xl px-3.5 py-2.5">
                        {c}
                      </button>
                    ))}
                  </div>
                ) : courante.type === '2v1f' ? (
                  <div className="flex flex-col gap-2">
                    {courante.affirmations.map((a) => (
                      <button key={a} onClick={() => repondre(a)}
                              className="text-left text-[13px] text-encre bg-creme/60 border border-parchemin-bordure rounded-xl px-3.5 py-2.5">
                        {a}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-2.5">
                    <button onClick={() => repondre('Vrai')}
                            className="flex-1 text-[13px] font-semibold text-encre bg-creme/60 border border-parchemin-bordure rounded-xl py-2.5">Vrai</button>
                    <button onClick={() => repondre('Faux')}
                            className="flex-1 text-[13px] font-semibold text-encre bg-creme/60 border border-parchemin-bordure rounded-xl py-2.5">Faux</button>
                  </div>
                )}
              </div>

              {/* Verso : rappel question + réponse + explication */}
              <div className="[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] max-h-[65vh] overflow-y-auto scroll-discret bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)] flex flex-col gap-3">
                <div className="flex gap-1.5">
                  <Badge className={`${bt.bg} ${bt.text}`}>{courante.theme}</Badge>
                  <Badge className={reponseChoisie === courante.reponse ? 'bg-vert-cta/15 text-vert-cta' : 'bg-terra-500/15 text-terra-700'}>
                    {reponseChoisie === courante.reponse ? 'Bonne réponse' : 'Raté'}
                  </Badge>
                </div>
                <p className="text-[14px] font-medium text-encre leading-relaxed">{courante.question}</p>
                <p className="text-[15px] font-semibold text-encre">{LIBELLE_REPONSE[courante.type] ?? 'Réponse'} : {courante.reponse}</p>
                <p className="text-[13px] text-encre-douce leading-relaxed whitespace-pre-line">{courante.explication}</p>
                {poolTirage.length > 0 ? (
                  <button onClick={suivante}
                          className="self-center mt-1 inline-flex items-center gap-1.5 bg-vert-cta text-creme font-semibold text-[13px] rounded-full px-5 py-2.5">
                    <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />Encore !
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 mt-1">
                    <p className="text-[12px] text-encre-douce/80 text-center">Plus de questions avec ces filtres.</p>
                    <button onClick={() => setCourante(null)}
                            className="text-[12.5px] font-semibold text-sepia">
                      Retour
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}