import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, RefreshCw, Play, Ban, SkipForward, Check } from 'lucide-react';
import { db } from '../db';
import MOTS from '../donnees/tabou.json';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « TABOU »
   ──────────────────────────────────────────────────────────────────
   • Mots dans ../donnees/tabou.json (schéma : id, mot, interdits :
     tableau de mots interdits).
   • Statut "fait" stocké dans Dexie (table `tabouFait`, clé = id du
     mot) — écrit uniquement quand on appuie sur "Réussi", pas au
     simple tirage. "Passer" tire une nouvelle carte sans rien marquer,
     le mot passé reste disponible pour un tirage ultérieur.
     À ajouter au schéma db.js si absent : tabouFait: 'id, date'
   • Pas de filtres ici : juste Lancer / Passer / Réussi / Réinitialiser.
   ════════════════════════════════════════════════════════════════════ */

function Entete() {
  return (
    <div className="relative px-5 pt-5 pb-1">
      <Link to="/jeux/mini-jeux" aria-label="Retour"
            className="inline-flex w-[38px] h-[38px] rounded-full items-center justify-center bg-[rgba(255,250,235,0.45)] border border-parchemin-bordure">
        <ArrowLeft className="w-5 h-5 text-encre-douce" strokeWidth={1.9} />
      </Link>
      <h1 className="font-serif uppercase tracking-[2px] text-[25px] text-encre font-semibold text-center -mt-6">Tabou</h1>
      <p className="text-center text-[12.5px] text-sepia mt-0.5">Fais deviner le mot sans les mots interdits</p>
    </div>
  );
}

function CarteTabou({ mot }) {
  return (
    <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl shadow-[0_4px_12px_rgba(60,40,20,0.12)] overflow-hidden">
      <div className="px-5 pt-8 pb-7 text-center border-b border-parchemin-bordure">
        <p className="font-serif text-[30px] text-encre font-semibold leading-tight">{mot.mot}</p>
      </div>
      <div className="px-5 py-4 flex flex-col gap-2.5">
        {mot.interdits.map((m) => (
          <div key={m} className="flex items-center gap-2 text-[14px] text-terra-700 font-medium">
            <Ban className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Tabou() {
  const [courante, setCourante] = useState(null);

  const faitesDB = useLiveQuery(() => db.tabouFait.toArray(), []) ?? [];
  const faitesIds = useMemo(() => new Set(faitesDB.map((f) => f.id)), [faitesDB]);

  const total = MOTS.length;
  const faites = MOTS.filter((m) => faitesIds.has(m.id)).length;
  const restants = total - faites;

  const poolTirage = useMemo(
    () => MOTS.filter((m) => !faitesIds.has(m.id)),
    [faitesIds]
  );

  function lancer() {
    if (poolTirage.length === 0) {
      setCourante(null);
      return;
    }
    const mot = poolTirage[Math.floor(Math.random() * poolTirage.length)];
    setCourante(mot);
  }

  function passer() {
    const candidats = poolTirage.filter((m) => m.id !== courante?.id);
    const source = candidats.length ? candidats : poolTirage;
    if (source.length === 0) {
      setCourante(null);
      return;
    }
    const mot = source[Math.floor(Math.random() * source.length)];
    setCourante(mot);
  }

  function reussi() {
    if (!courante) return;
    const motTermine = courante;

    const candidats = poolTirage.filter((m) => m.id !== motTermine.id);
    const prochaine = candidats.length > 0
      ? candidats[Math.floor(Math.random() * candidats.length)]
      : null;
    setCourante(prochaine);

    try {
      db.tabouFait.put({ id: motTermine.id, date: new Date().toISOString() })
        .catch((err) => console.error('Erreur en enregistrant le mot tabou :', err));
    } catch (err) {
      console.error('Erreur en enregistrant le mot tabou :', err);
    }
  }

  function reinitialiser() {
    setCourante(null);
    try {
      db.tabouFait.bulkDelete(MOTS.map((m) => m.id))
        .catch((err) => console.error('Erreur en réinitialisant tabou :', err));
    } catch (err) {
      console.error('Erreur en réinitialisant tabou :', err);
    }
  }

  const messageVide = () => {
    if (total === 0) return "Aucun mot pour l'instant — ajoute des mots dans tabou.json.";
    return 'Tous les mots ont été faits ! Réinitialise pour rejouer.';
  };

  return (
    <div className="fond-carte relative min-h-full overflow-hidden">
      <div className="vignette-carte" aria-hidden="true" />
      <Entete />

      {/* Compteur + réinitialiser */}
      <div className="relative px-5 pt-4">
        <div className="flex items-center justify-between text-[12px] text-encre-douce mb-1.5">
          <span>{faites} fait(s) · {restants} restant(s)</span>
          <button onClick={reinitialiser}
                  className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-sepia">
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />Réinitialiser
          </button>
        </div>
        <div className="h-1.5 rounded-full bg-parchemin-bordure overflow-hidden">
          <div className="h-full bg-vert-cta rounded-full transition-all duration-300"
               style={{ width: total ? `${(faites / total) * 100}%` : '0%' }} />
        </div>
      </div>

      {/* Corps */}
      <div className="relative px-5 pt-5 pb-6">
        {!courante ? (
          poolTirage.length === 0 ? (
            <div className="bg-parchemin-carte border border-parchemin-bordure rounded-2xl p-6 text-center shadow-[0_4px_12px_rgba(60,40,20,0.12)]">
              <p className="text-[13px] text-encre-douce leading-snug mb-4">{messageVide()}</p>
              {total > 0 && faites > 0 && (
                <button onClick={reinitialiser}
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-sepia">
                  <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />Réinitialiser
                </button>
              )}
            </div>
          ) : (
            <div className="flex justify-center pt-4">
              <button onClick={lancer}
                      className="inline-flex items-center gap-2 bg-vert-cta text-creme font-semibold text-[13.5px] rounded-full px-6 py-3.5 shadow-[0_8px_18px_rgba(35,64,52,0.35)]">
                <Play className="w-4 h-4" strokeWidth={2} fill="currentColor" />Lancer une carte
              </button>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-4">
            <CarteTabou mot={courante} />
            <div className="flex justify-center gap-3">
              <button onClick={passer}
                      className="inline-flex items-center gap-2 bg-parchemin-carte border border-parchemin-bordure text-encre-douce font-semibold text-[13px] rounded-full px-5 py-2.5">
                <SkipForward className="w-3.5 h-3.5" strokeWidth={2} />Passer
              </button>
              <button onClick={reussi}
                      className="inline-flex items-center gap-2 bg-vert-cta text-creme font-semibold text-[13px] rounded-full px-5 py-2.5">
                <Check className="w-4 h-4" strokeWidth={2.5} />Réussi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}