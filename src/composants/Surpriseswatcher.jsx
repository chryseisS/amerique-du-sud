import { useEffect, useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Gift } from 'lucide-react';
import { db } from '../db';
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
     passent pas non plus par ce watcher : une fois la surprise
     elle-même débloquée, la progression jour par jour est calculée
     directement dans DetailSurprise.jsx à partir de sa date de
     déblocage (voir `jours` / `heuresDepuisDebut` dans ce fichier).
   • Dès qu'une condition est remplie : marque la surprise comme
     débloquée dans Dexie (table `surprisesDebloquees`) et affiche une
     notification plein écran qui ne se ferme qu'au bouton "OK".
   • S'il y a plusieurs déblocages d'un coup, les notifications
     s'enchaînent une par une.
   • Un tic toutes les 5 minutes force une re-vérification, pour que
     'date' se débloque même si l'app reste ouverte en arrière-plan
     sans qu'aucune autre donnée ne change entretemps.

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

export default function SurprisesWatcher() {
  const evenementsDB = useLiveQuery(() => db.evenements.toArray(), []);
  const clesEvenements = useMemo(() => new Set((evenementsDB ?? []).map((e) => e.cle)), [evenementsDB]);

  const debloqueesDB = useLiveQuery(() => db.surprisesDebloquees.toArray(), []);
  const debloqueesIds = useMemo(() => new Set((debloqueesDB ?? []).map((d) => d.id)), [debloqueesDB]);

  const [file, setFile] = useState([]);
  const enCours = useRef(new Set()); // évite de re-traiter une surprise pendant l'écriture Dexie en cours

  const [tic, setTic] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTic((t) => t + 1), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Tant que les deux requêtes n'ont pas résolu, on ne sait pas encore
    // ce qui est déjà débloqué — ne rien vérifier pour éviter de
    // ré-écrire/ré-notifier une surprise déjà acquise.
    if (evenementsDB === undefined || debloqueesDB === undefined) return;

    async function verifier() {
      for (const s of SURPRISES) {
        if (debloqueesIds.has(s.id) || enCours.current.has(s.id)) continue;
        if (!estDeclenchee(s.declencheur, clesEvenements)) continue;

        enCours.current.add(s.id);
        await db.surprisesDebloquees.put({ id: s.id, date: new Date().toISOString() });
        setFile((f) => [...f, s]);
      }
    }
    verifier();
  }, [clesEvenements, debloqueesIds, tic, evenementsDB, debloqueesDB]);

  if (file.length === 0) return null;

  const courante = file[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 max-w-[320px] w-full text-center shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
        <Gift className="w-8 h-8 text-vert-cta mx-auto mb-3" strokeWidth={1.6} />
        <p className="text-[11px] uppercase tracking-[2px] text-sepia font-semibold mb-1">Surprise débloquée</p>
        <p className="font-serif text-[19px] text-encre font-semibold leading-tight mb-5">{courante.titre}</p>
        <button onClick={() => setFile((f) => f.slice(1))}
                className="inline-flex items-center justify-center bg-vert-cta text-creme font-semibold text-[13.5px] rounded-full px-8 py-2.5">
          OK
        </button>
      </div>
    </div>
  );
}