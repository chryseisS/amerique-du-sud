import { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import { db } from '../db';
import SURPRISES from '../donnees/surprises.json';

/* ════════════════════════════════════════════════════════════════════
   Une surprise a soit un contenu unique (texte/defiTitre/format/...
   directement sur l'objet), soit plusieurs jours (`jours: [...]`, un
   objet par jour avec le même schéma de contenu). Voir plus bas pour
   le détail du schéma de contenu et celui d'un trek à jours.

   ─── Schéma d'un « contenu » (surprise simple, ou un jour de trek) ───

   • 'texte' (par défaut, pas de `format`) :
       { texte, defiTitre? }
     `texte` = whitespace-pre-line, respecte les \n\n du JSON.
     `defiTitre` (optionnel) = un titre de défi mis en avant, affiché
     au-dessus du texte dans un style distinct (vert, majuscules).
     Ex. flamant rose : defiTitre = "FLAMANT ROSE DÉBLOQUÉ",
     texte = "Une jambe. Puis l'autre. Le flamant vous observe..."

   • 'questions' :
       { texte?, questions: [str, str, ...] }
     Affiche les questions une par une (aucune réponse attendue —
     pensé pour une rétrospective à deux), navigation par flèches
     précédent/suivant. `texte` optionnel sert d'intro avant la
     première question.

   • 'qcm' :
       { texte?, questions: [{ question, choix: [str,...], bonneReponse: index }, ...] }
     QCM avec navigation libre entre les questions (flèches). Une
     réponse choisie devient définitive pour cette question (verte si
     correcte, rouge si fausse — la bonne réponse est révélée en vert
     dans tous les cas). Revenir sur une question déjà répondue montre
     le même état, rien n'est oublié pendant que tu navigues.

   • 'mots-aleatoires' :
       { texte?, defiTitre?, motsDisponibles: [str, str, ...] }
     Tire 3 mots au hasard (sans doublon) dans `motsDisponibles` à
     l'ouverture de l'écran, et les garde stables tant que tu restes
     dessus (revenir plus tard en retire 3 nouveaux). Mets-en une
     quinzaine dans `motsDisponibles` pour une bonne variété.

   ─── Surprise à plusieurs jours (trek) ───

   { jours: [{ titre?, heuresDepuisDebut, ...contenu }, ...] }

   `heuresDepuisDebut` = nombre d'heures après le déblocage DE LA
   SURPRISE (pas du jour précédent) auquel ce jour devient accessible.
   Jour 1 a normalement heuresDepuisDebut: 0 (accessible dès que la
   surprise elle-même est débloquée, typiquement par mot de passe).
   Navigation libre entre jours déjà accessibles ou non (flèches) ; un
   jour pas encore accessible affiche juste un compte à rebours, sans
   révéler son contenu.
   ════════════════════════════════════════════════════════════════════ */

function tirerMots(liste, n) {
  const copie = [...liste];
  const resultat = [];
  for (let i = 0; i < n && copie.length > 0; i++) {
    const idx = Math.floor(Math.random() * copie.length);
    resultat.push(copie.splice(idx, 1)[0]);
  }
  return resultat;
}

// Rend le contenu d'UNE surprise simple, ou d'UN jour de trek. Isolé
// dans son propre composant pour porter son propre état (question
// courante, réponses, mots tirés) — utiliser une `key` différente par
// jour (voir plus bas) force un remontage propre à chaque changement
// de jour.
function RenduSurprise({ contenu }) {
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [reponses, setReponses] = useState({});
  const [mots] = useState(() => (
    contenu.format === 'mots-aleatoires' && contenu.motsDisponibles?.length
      ? tirerMots(contenu.motsDisponibles, 3)
      : []
  ));

  if (contenu.format === 'questions' && contenu.questions?.length) {
    const total = contenu.questions.length;
    const question = contenu.questions[indexQuestion];
    return (
      <>
        {contenu.texte && (
          <p className="font-serif text-[15px] text-encre-douce leading-relaxed whitespace-pre-line">{contenu.texte}</p>
        )}
        <div className="w-full flex items-center justify-between gap-3 mt-2">
          <button onClick={() => setIndexQuestion((i) => Math.max(0, i - 1))}
                  disabled={indexQuestion === 0}
                  aria-label="Question précédente"
                  className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-parchemin-carte border border-parchemin-bordure disabled:opacity-30">
            <ChevronLeft className="w-5 h-5 text-encre-douce" strokeWidth={2} />
          </button>
          <div className="flex-1 bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
            <p className="font-serif text-[16px] text-encre leading-snug text-center">{question}</p>
          </div>
          <button onClick={() => setIndexQuestion((i) => Math.min(total - 1, i + 1))}
                  disabled={indexQuestion === total - 1}
                  aria-label="Question suivante"
                  className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-parchemin-carte border border-parchemin-bordure disabled:opacity-30">
            <ChevronRight className="w-5 h-5 text-encre-douce" strokeWidth={2} />
          </button>
        </div>
        <p className="text-[11px] text-sepia">{indexQuestion + 1} / {total}</p>
      </>
    );
  }

  if (contenu.format === 'qcm' && contenu.questions?.length) {
    const total = contenu.questions.length;
    const question = contenu.questions[indexQuestion];
    const reponseDonnee = reponses[indexQuestion];

    function choisir(indexChoix) {
      if (reponseDonnee !== undefined) return;
      setReponses((r) => ({ ...r, [indexQuestion]: indexChoix }));
    }

    function classeChoix(i) {
      if (reponseDonnee === undefined) {
        return 'bg-parchemin-carte border-parchemin-bordure text-encre-douce';
      }
      const estCorrect = i === question.bonneReponse;
      const estChoisi = i === reponseDonnee;
      if (estCorrect) return 'bg-vert-cta/15 border-vert-cta text-vert-cta';
      if (estChoisi) return 'bg-terra-500/15 border-terra-500 text-terra-500';
      return 'bg-parchemin-carte border-parchemin-bordure text-encre-douce/50';
    }

    return (
      <>
        {contenu.texte && indexQuestion === 0 && (
          <p className="font-serif text-[15px] text-encre-douce leading-relaxed whitespace-pre-line">{contenu.texte}</p>
        )}
        <div className="w-full bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
          <p className="font-serif text-[16px] text-encre leading-snug text-center">{question.question}</p>
        </div>
        <div className="w-full flex flex-col gap-2.5">
          {question.choix.map((choix, i) => (
            <button key={i} onClick={() => choisir(i)} disabled={reponseDonnee !== undefined}
                    className={`w-full text-left border rounded-xl px-4 py-3 text-[13.5px] font-medium transition-colors ${classeChoix(i)}`}>
              {choix}
            </button>
          ))}
        </div>
        <div className="w-full flex items-center justify-between gap-3 mt-1">
          <button onClick={() => setIndexQuestion((i) => Math.max(0, i - 1))}
                  disabled={indexQuestion === 0}
                  aria-label="Question précédente"
                  className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-parchemin-carte border border-parchemin-bordure disabled:opacity-30">
            <ChevronLeft className="w-5 h-5 text-encre-douce" strokeWidth={2} />
          </button>
          <p className="text-[11px] text-sepia">{indexQuestion + 1} / {total}</p>
          <button onClick={() => setIndexQuestion((i) => Math.min(total - 1, i + 1))}
                  disabled={indexQuestion === total - 1}
                  aria-label="Question suivante"
                  className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-parchemin-carte border border-parchemin-bordure disabled:opacity-30">
            <ChevronRight className="w-5 h-5 text-encre-douce" strokeWidth={2} />
          </button>
        </div>
      </>
    );
  }

  if (contenu.format === 'mots-aleatoires' && mots.length > 0) {
    return (
      <>
        {contenu.defiTitre && (
          <p className="font-serif uppercase tracking-[2px] text-[16px] text-vert-cta font-bold">{contenu.defiTitre}</p>
        )}
        {contenu.texte && (
          <p className="font-serif text-[15px] text-encre-douce leading-relaxed whitespace-pre-line">{contenu.texte}</p>
        )}
        <div className="flex flex-wrap justify-center gap-2.5">
          {mots.map((mot) => (
            <span key={mot}
                  className="font-serif text-[17px] text-encre font-semibold bg-parchemin-carte border border-parchemin-bordure rounded-full px-4 py-2">
              {mot}
            </span>
          ))}
        </div>
      </>
    );
  }

  // ─── format « texte » (par défaut) ───
  return (
    <>
      {contenu.defiTitre && (
        <p className="font-serif uppercase tracking-[2px] text-[16px] text-vert-cta font-bold">{contenu.defiTitre}</p>
      )}
      <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-5 shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
        <p className="font-serif text-[15px] text-encre leading-relaxed whitespace-pre-line">{contenu.texte}</p>
      </div>
    </>
  );
}

export default function DetailSurprise() {
  const { surpriseId } = useParams();
  const surprise = SURPRISES.find((s) => s.id === surpriseId);

  const debloqueesDB = useLiveQuery(() => db.surprisesDebloquees.toArray(), []);
  const debloqueesMap = useMemo(
    () => new Map((debloqueesDB ?? []).map((d) => [d.id, d.date])),
    [debloqueesDB]
  );

  const [indexJour, setIndexJour] = useState(0);

  // Tant que la requête Dexie n'a pas encore résolu, on ne sait pas
  // encore si la surprise est débloquée — ne pas rediriger trop tôt.
  if (debloqueesDB === undefined) {
    return null;
  }

  const dateDebloquee = surprise ? debloqueesMap.get(surprise.id) : undefined;

  if (!surprise || !dateDebloquee) {
    return <Navigate to="/jeux/surprises" replace />;
  }

  const entete = (
    <div className="relative px-5 pt-5 pb-2">
      <Link to="/jeux/surprises" aria-label="Retour"
            className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
        <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
      </Link>
    </div>
  );

  const aDesJours = Array.isArray(surprise.jours) && surprise.jours.length > 0;

  // ─── Surprise à plusieurs jours (trek) ───
  if (aDesJours) {
    const totalJours = surprise.jours.length;
    const jour = surprise.jours[indexJour];
    const heuresEcoulees = (Date.now() - new Date(dateDebloquee).getTime()) / 3_600_000;
    const seuil = jour.heuresDepuisDebut ?? 0;
    const jourAccessible = heuresEcoulees >= seuil;

    return (
      <div className="fond-carte relative min-h-full overflow-hidden">
        <div className="vignette-carte" aria-hidden="true" />
        {entete}

        <div className="relative px-6 pb-10 pt-2 flex flex-col items-center text-center gap-5">
          <Gift className="w-8 h-8 text-vert-cta" strokeWidth={1.6} />

          <div className="w-full flex items-center justify-between gap-3">
            <button onClick={() => setIndexJour((i) => Math.max(0, i - 1))}
                    disabled={indexJour === 0}
                    aria-label="Jour précédent"
                    className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-parchemin-carte border border-parchemin-bordure disabled:opacity-30">
              <ChevronLeft className="w-5 h-5 text-encre-douce" strokeWidth={2} />
            </button>
            <p className="font-serif text-[15px] text-encre font-semibold uppercase tracking-wide">
              {jour.titre ?? `Jour ${indexJour + 1}`}
            </p>
            <button onClick={() => setIndexJour((i) => Math.min(totalJours - 1, i + 1))}
                    disabled={indexJour === totalJours - 1}
                    aria-label="Jour suivant"
                    className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-parchemin-carte border border-parchemin-bordure disabled:opacity-30">
              <ChevronRight className="w-5 h-5 text-encre-douce" strokeWidth={2} />
            </button>
          </div>

          {jourAccessible ? (
            <RenduSurprise key={indexJour} contenu={jour} />
          ) : (
            <p className="text-[13px] text-encre-douce leading-relaxed">
              Se débloque dans environ {Math.max(1, Math.ceil(seuil - heuresEcoulees))}h.
            </p>
          )}

          <p className="text-[11px] text-sepia">{indexJour + 1} / {totalJours}</p>
        </div>
      </div>
    );
  }

  // ─── Surprise simple (contenu unique) ───
  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />
      {entete}

      <div className="relative px-6 pb-10 pt-2 flex flex-col items-center text-center gap-5">
        <Gift className="w-8 h-8 text-vert-cta" strokeWidth={1.6} />
        <RenduSurprise contenu={surprise} />
      </div>
    </div>
  );
}