import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Gift } from 'lucide-react';
import { db } from '../db';
import { declencherEvenement } from '../declencheurs';
import SURPRISES from '../donnees/surprises.json';

/* ════════════════════════════════════════════════════════════════════
   SURPRISES WATCHER
   ──────────────────────────────────────────────────────────────────
   À monter UNE SEULE FOIS, au niveau racine de l'app (voir App.jsx),
   en dehors des <Routes> pour qu'il tourne quel que soit l'écran
   affiché.
   • Compare chaque surprise pas encore débloquée à :
       - la date du jour (type 'date')
       - le journal d'événements `evenements` (type 'animal' — voir
         declencheurs.js, déclenché depuis DetailFaune.jsx ; type
         'defi' — un seul événement requis, ex. déclenché depuis
         PremieresFois.jsx quand un défi est marqué fait ; type
         'defis' — PLUSIEURS événements 'defi' requis en même temps,
         valeur = tableau d'ids premieresFois, ex. { type: 'defis',
         valeur: ['course-santiago', 'course-la-paz', ...] })
   • Les surprises de type 'mot-de-passe' ne sont JAMAIS débloquées ici
     — c'est volontaire, elles ne se déverrouillent que depuis
     Surprises.jsx quand le mot de passe est saisi et validé à la main.
   • Les surprises à plusieurs jours (`jours: [...]`, ex. un trek) ne
     sont pas débloquées jour par jour ici : une fois la surprise
     elle-même débloquée, l'accès à chaque jour est calculé dans
     DetailSurprise.jsx à partir de sa date de déblocage. En revanche,
     ce watcher ANNONCE chaque nouveau jour (heuresDepuisDebut > 0)
     dès qu'il devient accessible : notification "Jour N débloqué",
     dont le bouton ouvre la surprise directement sur ce jour
     (navigate avec state: { jour: index }). L'annonce est mémorisée
     dans `evenements` sous la clé `jour-notifie:<surpriseId>:<index>`
     (aucune table à ajouter). Si plusieurs jours sont passés d'un coup
     (app fermée longtemps), une seule notification : le plus récent.
   • Dès qu'une condition est remplie : marque la surprise comme
     débloquée dans Dexie (table `surprisesDebloquees`) et affiche une
     notification plein écran avec deux boutons : "Voir la surprise"
     (ouvre directement sa page) ou "Plus tard" (ferme simplement).
   • S'il y a plusieurs déblocages d'un coup, les notifications
     s'enchaînent une par une.
   • Pendant un import de sauvegarde (Reglages.jsx envoie les événements
     'import-debut' / 'import-fin'), le watcher se met en pause : la base
     est alors vidée puis réécrite table par table, et il pourrait voir
     des événements restaurés avant les surprises déjà débloquées, donc
     tout re-débloquer et notifier. À la fin de l'import, la file de
     notifications est vidée et tout est re-vérifié sur la base propre
     (seules les surprises vraiment nouvelles notifieront).
   • Un tic toutes les minutes — et à chaque retour de l'app au premier
     plan — force une re-vérification, pour que 'date' et les nouveaux
     jours de trek se débloquent même si aucune autre donnée ne change.
     (Notification dans l'app uniquement : si la PWA est fermée, elle
     apparaît à la réouverture.)

   Tables Dexie à ajouter dans db.js si absentes :
     evenements: 'cle, date'
     surprisesDebloquees: 'id, date'
   ════════════════════════════════════════════════════════════════════ */

function estDeclenchee(declencheur, clesEvenements) {
  if (!declencheur) return false;
  if (declencheur.type === 'date') {
    return new Date() >= new Date(declencheur.valeur);
  }
  if (declencheur.type === 'mot-de-passe') return false;
  if (declencheur.type === 'defis' && Array.isArray(declencheur.valeur)) {
    // Toutes les valeurs doivent être présentes (ex. un défi par pays/capitale).
    return declencheur.valeur.every((v) => clesEvenements.has(`defi:${v}`));
  }
  return clesEvenements.has(`${declencheur.type}:${declencheur.valeur}`);
}

// Confettis de la notification : 14 petits éclats qui partent en étoile depuis l'icône.
// Valeurs déterministes (pas de Math.random) pour un rendu identique à chaque déblocage.
const COULEURS_CONFETTIS = ['#a4763a', '#234034', '#c9623f', '#e0b04a'];
const PARTICULES = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const distance = 78 + (i % 3) * 20;
  return {
    dx: Math.round(Math.cos(angle) * distance),
    dy: Math.round(Math.sin(angle) * distance),
    rot: (i % 2 ? 1 : -1) * (120 + i * 20),
    couleur: COULEURS_CONFETTIS[i % COULEURS_CONFETTIS.length],
    taille: 5 + (i % 3) * 2,
    delai: 250 + (i % 4) * 25,
  };
});

export default function SurprisesWatcher() {
  const navigate = useNavigate();
  const evenementsDB = useLiveQuery(() => db.evenements.toArray(), []);
  const clesEvenements = useMemo(() => new Set((evenementsDB ?? []).map((e) => e.cle)), [evenementsDB]);

  const debloqueesDB = useLiveQuery(() => db.surprisesDebloquees.toArray(), []);
  const debloqueesIds = useMemo(() => new Set((debloqueesDB ?? []).map((d) => d.id)), [debloqueesDB]);
  const debloqueesMap = useMemo(() => new Map((debloqueesDB ?? []).map((d) => [d.id, d.date])), [debloqueesDB]);

  const [file, setFile] = useState([]);
  const enCours = useRef(new Set()); // évite de re-traiter une surprise pendant l'écriture Dexie en cours

  const enPause = useRef(false); // true pendant un import de sauvegarde

  const [tic, setTic] = useState(0);
  useEffect(() => {
    const debut = () => { enPause.current = true; };
    const fin = () => {
      enCours.current.clear();
      setFile([]);                  // jette les notifications nées pendant l'import
      enPause.current = false;
      setTic((t) => t + 1);         // re-vérifie sur la base restaurée
    };
    window.addEventListener('import-debut', debut);
    window.addEventListener('import-fin', fin);
    return () => {
      window.removeEventListener('import-debut', debut);
      window.removeEventListener('import-fin', fin);
    };
  }, []);
  useEffect(() => {
    const id = setInterval(() => setTic((t) => t + 1), 60 * 1000);
    // Une PWA en arrière-plan voit ses timers suspendus : on revérifie au retour.
    const auRetour = () => { if (document.visibilityState === 'visible') setTic((t) => t + 1); };
    document.addEventListener('visibilitychange', auRetour);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', auRetour);
    };
  }, []);

  useEffect(() => {
    // Tant que les deux requêtes n'ont pas résolu, on ne sait pas encore
    // ce qui est déjà débloqué — ne rien vérifier pour éviter de
    // ré-écrire/ré-notifier une surprise déjà acquise.
    if (evenementsDB === undefined || debloqueesDB === undefined) return;
    if (enPause.current) return;

    async function verifier() {
      for (const s of SURPRISES) {
        if (enPause.current) return;
        if (debloqueesIds.has(s.id) || enCours.current.has(s.id)) continue;
        if (!estDeclenchee(s.declencheur, clesEvenements)) continue;

        enCours.current.add(s.id);
        await db.surprisesDebloquees.put({ id: s.id, date: new Date().toISOString() });
        setFile((f) => [...f, { surprise: s }]);
      }

      // Nouveaux jours d'une surprise à plusieurs jours déjà débloquée.
      // Le jour 1 (heuresDepuisDebut: 0) est couvert par la notif de déblocage.
      for (const s of SURPRISES) {
        if (enPause.current) return;
        if (!Array.isArray(s.jours) || !debloqueesMap.has(s.id)) continue;

        const heures = (Date.now() - new Date(debloqueesMap.get(s.id)).getTime()) / 3_600_000;
        const nouveaux = [];
        s.jours.forEach((j, i) => {
          const seuil = j.heuresDepuisDebut ?? 0;
          if (seuil <= 0 || heures < seuil) return;
          if (clesEvenements.has(`jour-notifie:${s.id}:${i}`)) return;
          if (enCours.current.has(`jour:${s.id}:${i}`)) return;
          nouveaux.push(i);
        });
        if (nouveaux.length === 0) continue;

        // Réserve tout de suite (synchrone) pour éviter un doublon si l'effet
        // se relance pendant les écritures Dexie ci-dessous.
        nouveaux.forEach((i) => enCours.current.add(`jour:${s.id}:${i}`));
        for (const i of nouveaux) {
          await declencherEvenement('jour-notifie', `${s.id}:${i}`);
        }
        setFile((f) => [...f, { surprise: s, jourIndex: nouveaux[nouveaux.length - 1] }]);
      }
    }
    verifier();
  }, [clesEvenements, debloqueesIds, debloqueesMap, tic, evenementsDB, debloqueesDB]);

  if (file.length === 0) return null;

  const { surprise: courante, jourIndex } = file[0];
  const estJour = jourIndex != null;
  const jour = estJour ? courante.jours[jourIndex] : null;

  return (
    <div className="anim-fondu fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      {/* key = id : l'animation rejoue pour chaque notification de la file */}
      <div key={`${courante.id}:${jourIndex ?? 'debloquee'}`}
           className="anim-carte-pop bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 max-w-[320px] w-full text-center shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
        <div className="relative w-14 h-14 mx-auto mb-3 flex items-center justify-center">
          <span className="anim-halo absolute inset-0 rounded-full bg-[#a4763a]/40" aria-hidden="true" />
          <span className="anim-halo absolute inset-0 rounded-full bg-[#a4763a]/30" style={{ animationDelay: '380ms' }} aria-hidden="true" />
          {PARTICULES.map((p, i) => (
            <span key={i} aria-hidden="true"
                  className="anim-particule absolute left-1/2 top-1/2 rounded-[2px]"
                  style={{
                    width: p.taille, height: p.taille,
                    marginLeft: -p.taille / 2, marginTop: -p.taille / 2,
                    backgroundColor: p.couleur,
                    animationDelay: `${p.delai}ms`,
                    '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--rot': `${p.rot}deg`,
                  }} />
          ))}
          <Gift className="anim-cadeau relative w-8 h-8 text-vert-cta" strokeWidth={1.6} />
        </div>
        <p className="anim-monte text-[11px] uppercase tracking-[2px] text-sepia font-semibold mb-1"
           style={{ animationDelay: '350ms' }}>{estJour ? `${jour.titre ?? `Jour ${jourIndex + 1}`} débloqué` : 'Surprise débloquée'}</p>
        <p className="anim-monte font-serif text-[19px] text-encre font-semibold leading-tight mb-5"
           style={{ animationDelay: '450ms' }}>{courante.titre}</p>
        <div className="anim-monte flex flex-col gap-2" style={{ animationDelay: '600ms' }}>
          <button onClick={() => {
                    setFile((f) => f.slice(1));
                    navigate(`/jeux/surprises/${courante.id}`, estJour ? { state: { jour: jourIndex } } : undefined);
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-vert-cta text-creme font-semibold text-[13.5px] rounded-full px-6 py-2.5">
            <Gift className="w-4 h-4" strokeWidth={2} />{estJour ? 'Voir ce jour' : 'Voir la surprise'}
          </button>
          <button onClick={() => setFile((f) => f.slice(1))}
                  className="text-[12.5px] font-semibold text-sepia py-1.5">
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}