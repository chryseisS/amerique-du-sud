import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ChevronRight, Lock, Gift } from 'lucide-react';
import { db } from '../db';
import SURPRISES from '../donnees/surprises.json';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « SURPRISES »  — route /jeux/surprises
   ──────────────────────────────────────────────────────────────────
   • Données dans ../donnees/surprises.json. Schéma d'une surprise :
       {
         id, titre, raison, texte,
         declencheur: { type, valeur },
         defiTitre?,           // titre de défi mis en avant (voir DetailSurprise.jsx)
         format?, questions?,  // format: 'questions' pour une rétrospective (voir DetailSurprise.jsx)
         indice?,              // mise en scène affichée à la place du
                                // générique "Entre le mot de passe" —
                                // uniquement pour type 'mot-de-passe'.
                                // Ex. "Contrôle de frontière — hémisphère
                                // nord.\n\nDouanier : « Mot de passe ? »"
         titreVerrou,          // titre affiché tant que c'est verrouillé
                                // — À TOI de le renseigner, toujours.
                                // Sans lui, affiche l'id brut (pour que
                                // tu repères vite l'oubli).
         conditionVerrou,      // texte affiché en dessous tant que
                                // c'est verrouillé — à toi aussi de le
                                // renseigner, toujours. Sans lui,
                                // n'affiche rien.
                                //
                                // Tant que c'est verrouillé, la pastille
                                // et le liseré de la carte sont teintés
                                // selon declencheur.type (voir
                                // couleurType ci-dessous) : bleu pour
                                // 'date', ambre pour 'mot-de-passe',
                                // vert pour 'animal'. Une fois débloquée,
                                // toutes les surprises reprennent le même
                                // style (vert + icône Gift).
         jours?                // pour une surprise à plusieurs jours
                                // (ex. un trek) — voir DetailSurprise.jsx.
                                // Remplace texte/format/questions/... au
                                // niveau racine par un tableau de jours,
                                // chacun avec son propre contenu et son
                                // propre heuresDepuisDebut.
       }
     type ∈ 'date' | 'animal' | 'mot-de-passe'
       - 'date'         → valeur = "AAAA-MM-JJ" (ISO), comparée à
         aujourd'hui, automatique (voir SurprisesWatcher.jsx)
       - 'animal'       → valeur = slug de l'espèce dans le module
         Faune, automatique (déclenché depuis DetailFaune.jsx)
       - 'mot-de-passe' → valeur = le mot de passe en clair (choisi par
         toi, un par surprise). Sert à tout ce qui n'a pas de suivi
         automatique : passage de frontière, altitude atteinte, jour 1
         d'un trek, défi réussi… Tape-le sur la carte verrouillée pour
         débloquer. Une fois débloquée, une surprise à plusieurs jours
         gère elle-même la suite (voir `jours` ci-dessus et
         DetailSurprise.jsx) — pas besoin d'un declencheur par jour.
   • Le statut débloqué est lu dans Dexie (table `surprisesDebloquees`,
     clé = id de la surprise). Pour 'date'/'animal', c'est
     SurprisesWatcher.jsx (monté une fois dans App.jsx) qui écrit dans
     cette table et affiche la notification "OK". Pour 'mot-de-passe',
     c'est cet écran qui écrit directement dedans une fois le mot de
     passe validé (pas de notification "OK" dans ce cas, le
     déverrouillage est déjà un geste volontaire).
   ════════════════════════════════════════════════════════════════════ */

// Teinte par type de déclencheur — uniquement tant que la surprise est
// verrouillée (une fois débloquée, toutes ont le même style vert/Gift).
function couleurType(type) {
  if (type === 'date') {
    return { fond: 'bg-surprise-date/15', bordure: 'border-surprise-date/40', icone: 'text-surprise-date', accent: 'border-l-surprise-date' };
  }
  if (type === 'mot-de-passe') {
    return { fond: 'bg-surprise-mdp/15', bordure: 'border-surprise-mdp/40', icone: 'text-surprise-mdp', accent: 'border-l-surprise-mdp' };
  }
  if (type === 'animal' || type === 'defi' || type === 'defis') {
    return { fond: 'bg-surprise-animal/15', bordure: 'border-surprise-animal/40', icone: 'text-surprise-animal', accent: 'border-l-surprise-animal' };
  }
  return { fond: 'bg-[#5a4a36]/10', bordure: 'border-parchemin-bordure', icone: 'text-sepia', accent: 'border-l-parchemin-bordure' };
}

export default function Surprises() {
  const debloqueesDB = useLiveQuery(() => db.surprisesDebloquees.toArray(), []) ?? [];
  const debloqueesIds = useMemo(() => new Set(debloqueesDB.map((d) => d.id)), [debloqueesDB]);

  const [ouvert, setOuvert] = useState(null); // id de la surprise dont le champ mot de passe est affiché
  const [saisie, setSaisie] = useState('');
  const [erreur, setErreur] = useState(false);

  const total = SURPRISES.length;
  const debloquees = SURPRISES.filter((s) => debloqueesIds.has(s.id)).length;

  function ouvrirChamp(id) {
    setOuvert(id);
    setSaisie('');
    setErreur(false);
  }

  function annuler() {
    setOuvert(null);
    setSaisie('');
    setErreur(false);
  }

  async function tenterDeverrouiller(surprise) {
    const attendu = (surprise.declencheur?.valeur ?? '').trim().toLowerCase();
    if (saisie.trim().toLowerCase() === attendu) {
      await db.surprisesDebloquees.put({ id: surprise.id, date: new Date().toISOString() });
      annuler();
    } else {
      setErreur(true);
    }
  }

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />

      {/* En-tête */}
      <div className="relative px-5 pt-5 pb-1">
        <Link to="/jeux" aria-label="Retour"
              className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
          <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif uppercase tracking-[2px] text-[24px] text-encre font-semibold text-center -mt-6">Surprises</h1>
        <p className="text-center text-[12.5px] text-sepia mt-0.5">Certaines se débloquent en cours de route…</p>
      </div>

      {/* Progression */}
      {total > 0 && (
        <div className="relative px-5 pt-3.5">
          <div className="text-[12px] text-encre-douce mb-1.5">{debloquees} / {total} débloquées</div>
          <div className="h-1.5 rounded-full bg-parchemin-bordure overflow-hidden">
            <div className="h-full bg-vert-cta rounded-full transition-all duration-300"
                 style={{ width: `${(debloquees / total) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="relative px-[18px] pt-4 pb-6 flex flex-col gap-3">
        {total === 0 ? (
          <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
            <p className="text-[13px] text-encre-douce leading-snug">Aucune surprise pour l'instant.</p>
          </div>
        ) : (
          SURPRISES.map((s) => {
            const debloquee = debloqueesIds.has(s.id);

            if (!debloquee) {
              const estMotDePasse = s.declencheur?.type === 'mot-de-passe';
              const titreAffiche = s.titreVerrou ?? s.id;
              const conditionAffichee = s.conditionVerrou ?? '';
              const c = couleurType(s.declencheur?.type);

              if (estMotDePasse && ouvert === s.id) {
                return (
                  <div key={s.id}
                       className={`flex flex-col gap-3 bg-parchemin-carte border border-parchemin-bordure border-l-[3px] ${c.accent} rounded-2xl p-4 shadow-[0_4px_12px_rgba(60,40,20,0.12)]`}>
                    <button type="button" onClick={annuler} className="flex items-center gap-3.5 text-left">
                      <div className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${c.fond} border ${c.bordure}`}>
                        <Lock className={`w-5 h-5 ${c.icone}`} strokeWidth={1.8} />
                      </div>
                      <h3 className="flex-1 min-w-0 font-serif text-[16px] leading-tight text-encre font-semibold m-0">{titreAffiche}</h3>
                    </button>

                    <p className="font-serif italic text-[13.5px] text-encre-douce leading-relaxed whitespace-pre-line">
                      {s.indice ?? 'Entre le mot de passe'}
                    </p>

                    <div className="flex gap-2">
                      <input type="text" value={saisie} autoFocus
                             onChange={(e) => { setSaisie(e.target.value); setErreur(false); }}
                             onKeyDown={(e) => e.key === 'Enter' && tenterDeverrouiller(s)}
                             placeholder="Mot de passe"
                             className="flex-1 bg-white border border-parchemin-bordure rounded-full px-3.5 py-2 text-[13px] text-encre-douce placeholder:text-encre-douce/50" />
                      <button onClick={() => tenterDeverrouiller(s)}
                              className="bg-vert-cta text-creme font-semibold text-[12.5px] rounded-full px-4">
                        OK
                      </button>
                    </div>
                    {erreur && <p className="text-[11px] text-terra-500">Mot de passe incorrect</p>}
                  </div>
                );
              }

              return (
                <button key={s.id} type="button"
                        disabled={!estMotDePasse}
                        onClick={() => estMotDePasse && (ouvert === s.id ? annuler() : ouvrirChamp(s.id))}
                        className={`flex items-center gap-3.5 bg-parchemin-carte/50 border border-parchemin-bordure border-l-[3px] ${c.accent} rounded-2xl p-4 opacity-60 text-left w-full ${estMotDePasse ? 'cursor-pointer' : ''}`}>
                  <div className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${c.fond} border ${c.bordure}`}>
                    <Lock className={`w-5 h-5 ${c.icone}`} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-[16px] leading-tight text-encre-douce font-semibold m-0">{titreAffiche}</h3>
                    <p className="text-[11.5px] text-encre-douce/70 mt-1">{conditionAffichee}</p>
                  </div>
                </button>
              );
            }

            return (
              <Link key={s.id} to={`/jeux/surprises/${s.id}`}
                    className="flex items-center gap-3.5 bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-4 shadow-[0_4px_12px_rgba(60,40,20,0.12)] transition-transform duration-200 hover:-translate-y-0.5">
                <div className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-vert-cta/10 border border-parchemin-bordure">
                  <Gift className="w-5 h-5 text-vert-cta" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-[16px] leading-tight text-encre font-semibold m-0">{s.titre}</h3>
                  <p className="text-[11.5px] text-encre-douce mt-1 leading-snug">{s.raison}</p>
                </div>
                <ChevronRight className="self-center shrink-0 w-5 h-5 text-encre/40" strokeWidth={2} />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}