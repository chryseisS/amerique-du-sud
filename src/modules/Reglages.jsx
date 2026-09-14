import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Upload, HardDrive, Loader2, Clock, Bell } from 'lucide-react';
import { exportDB, importInto } from 'dexie-export-import';
import { db } from '../db';
import { useEspaceStockage } from '../hooks/useEspaceStockage';

/* ════════════════════════════════════════════════════════════════════
   ÉCRAN « RÉGLAGES »  — route /journal/reglages
   ──────────────────────────────────────────────────────────────────
   • Export / import de TOUTE la base Dexie via `dexie-export-import`.
     À installer : npm install dexie-export-import
     L'export lit le schéma en direct : toute table ajoutée plus tard
     (nouveaux jeux, nouveaux modules…) sera incluse automatiquement,
     sans rien changer ici. Les Blobs (photos du journal) sont
     préservés tels quels, sans recompression.
   • L'import REMPLACE tout : chaque table est vidée avant d'être
     réécrite (clearTablesBeforeImport), avec confirmation préalable.
   ════════════════════════════════════════════════════════════════════ */

function formaterOctets(o) {
  if (o == null) return '—';
  if (o < 1024) return `${o} o`;
  if (o < 1024 * 1024) return `${(o / 1024).toFixed(0)} Ko`;
  if (o < 1024 * 1024 * 1024) return `${(o / (1024 * 1024)).toFixed(1)} Mo`;
  return `${(o / (1024 * 1024 * 1024)).toFixed(2)} Go`;
}

const CLE_DERNIER_EXPORT = 'dernierExport';
const SEUIL_ALERTE_JOURS = 7;

function texteDernierExport(dateISO) {
  if (!dateISO) return "Aucun export effectué pour l'instant.";
  const jours = Math.floor((Date.now() - new Date(dateISO).getTime()) / (1000 * 60 * 60 * 24));
  if (jours <= 0) return 'Dernier export : aujourd’hui.';
  if (jours === 1) return 'Dernier export : hier.';
  return `Dernier export : il y a ${jours} jours.`;
}

function Bloc({ children }) {
  return (
    <div className="bg-terra-100 border border-terra-border rounded-2xl p-4 flex flex-col gap-3">
      {children}
    </div>
  );
}

export default function Reglages() {
  const { usage, quota, rafraichir } = useEspaceStockage();

  const [enCours, setEnCours] = useState(null); // 'export' | 'import' | null
  const [message, setMessage] = useState(null); // { type: 'ok'|'erreur', texte }
  const [dernierExport, setDernierExport] = useState(() => localStorage.getItem(CLE_DERNIER_EXPORT));
  const [statutNotif, setStatutNotif] = useState(() => (
    'Notification' in window ? Notification.permission : 'non-supporte'
  ));
  const inputFichier = useRef(null);

  const joursDepuisExport = dernierExport
    ? Math.floor((Date.now() - new Date(dernierExport).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const alerteExport = joursDepuisExport === null || joursDepuisExport >= SEUIL_ALERTE_JOURS;

  async function exporter() {
    setEnCours('export');
    setMessage(null);
    try {
      const blob = await exportDB(db, { prettyJson: false });
      const date = new Date().toISOString().slice(0, 10);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mon-voyage-${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      const maintenant = new Date().toISOString();
      localStorage.setItem(CLE_DERNIER_EXPORT, maintenant);
      setDernierExport(maintenant);
      setMessage({ type: 'ok', texte: 'Export terminé — le fichier a été téléchargé.' });
    } catch (err) {
      console.error('Erreur export :', err);
      setMessage({ type: 'erreur', texte: "L'export a échoué. Détails dans la console." });
    } finally {
      setEnCours(null);
    }
  }

  async function demanderNotifications() {
    if (!('Notification' in window)) {
      setStatutNotif('non-supporte');
      return;
    }
    try {
      const resultat = await Notification.requestPermission();
      setStatutNotif(resultat);
      // Si accordé, on retente aussitôt la persistance — au cas où
      // c'est bien ce qui la débloque sur Safari.
      if (resultat === 'granted' && navigator.storage?.persist) {
        await navigator.storage.persist().catch(() => {});
      }
    } catch (err) {
      console.error('Erreur demande notifications :', err);
    }
  }

  function choisirFichier() {
    const ok = window.confirm(
      "L'import REMPLACE toutes les données actuelles de l'application (journal, photos, faune, gastronomie, jeux, surprises…).\n\n" +
      "Pense à faire un export d'abord si tu veux garder une sauvegarde de l'état actuel.\n\nContinuer ?"
    );
    if (ok) inputFichier.current?.click();
  }

  async function importer(e) {
    const fichier = e.target.files?.[0];
    e.target.value = ''; // permet de re-sélectionner le même fichier plus tard
    if (!fichier) return;

    setEnCours('import');
    setMessage(null);
    try {
      await importInto(db, fichier, { clearTablesBeforeImport: true });
      await rafraichir();
      setMessage({ type: 'ok', texte: 'Import terminé — toutes les données ont été remplacées.' });
    } catch (err) {
      console.error('Erreur import :', err);
      setMessage({ type: 'erreur', texte: "L'import a échoué. Le fichier est-il bien un export de cette app ?" });
    } finally {
      setEnCours(null);
    }
  }

  return (
    <div className="p-4">
      {/* Bouton retour */}
      <Link to="/journal" className="flex items-center gap-2 text-terra-500 mb-4">
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </Link>

      <h1 className="font-serif text-3xl text-terra-900 leading-tight mb-1">Réglages</h1>
      <div className="text-[10px] uppercase tracking-wider text-terra-muted mb-5">
        sauvegarde et stockage
      </div>

      <div className="flex flex-col gap-3">
        {/* ─── Sauvegarde ─── */}
        <Bloc>
          <div>
            <div className="font-serif text-lg text-terra-900 leading-tight">Mes données</div>
            <p className="text-[11.5px] text-terra-muted mt-1 leading-snug">
              L'export enregistre tout dans un fichier : journal et photos, gastronomie,
              faune, défis, jeux et surprises.
            </p>
          </div>

          <div className={`flex items-center gap-2 text-[11.5px] rounded-lg px-2.5 py-2 ${alerteExport ? 'bg-terra-500/10 text-terra-500' : 'bg-emerald-700/10 text-emerald-700'}`}>
            <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {texteDernierExport(dernierExport)}
          </div>

          <button onClick={exporter} disabled={enCours !== null}
                  className="w-full bg-terra-500 text-white rounded-xl py-3 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {enCours === 'export'
              ? <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />Export en cours…</>
              : <><Download className="w-4 h-4" strokeWidth={2} />Exporter mes données</>}
          </button>

          <button onClick={choisirFichier} disabled={enCours !== null}
                  className="w-full bg-white border border-terra-border text-terra-900 rounded-xl py-3 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {enCours === 'import'
              ? <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />Import en cours…</>
              : <><Upload className="w-4 h-4" strokeWidth={2} />Importer un fichier</>}
          </button>

          <p className="text-[10.5px] text-terra-muted/80 leading-snug">
            L'import remplace l'intégralité des données actuelles.
          </p>

          <input ref={inputFichier} type="file" accept="application/json,.json"
                 onChange={importer} className="hidden" />

          {message && (
            <p className={`text-[11.5px] leading-snug ${message.type === 'ok' ? 'text-emerald-700' : 'text-red-500'}`}>
              {message.texte}
            </p>
          )}
        </Bloc>

        {/* ─── Notifications (pour tenter de débloquer la persistance) ─── */}
        {statutNotif !== 'granted' && (
          <Bloc>
            <div>
              <div className="font-serif text-lg text-terra-900 leading-tight">Notifications</div>
              <p className="text-[11.5px] text-terra-muted mt-1 leading-snug">
                L'app n'envoie aucune notification. Les autoriser ne sert qu'à tenter de
                débloquer le stockage persistant sur Safari.
              </p>
            </div>

            {statutNotif === 'denied' ? (
              <p className="text-[11.5px] text-terra-muted leading-snug">
                Refusées précédemment — Safari ne redemandera pas. Pour changer d'avis :
                réglages du téléphone → Safari (ou l'app installée) → Notifications.
              </p>
            ) : statutNotif === 'non-supporte' ? (
              <p className="text-[11.5px] text-terra-muted leading-snug">
                Non disponible ici — ouvre l'app depuis son icône sur l'écran d'accueil.
              </p>
            ) : (
              <button onClick={demanderNotifications}
                      className="w-full bg-white border border-terra-border text-terra-900 rounded-xl py-2.5 font-medium text-xs flex items-center justify-center gap-2">
                <Bell className="w-3.5 h-3.5" strokeWidth={2} />Autoriser les notifications
              </button>
            )}
          </Bloc>
        )}

        {/* ─── Stockage ─── */}
        {usage != null && (
          <div className="flex items-center gap-2 text-[11.5px] text-terra-muted px-1">
            <HardDrive className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {formaterOctets(usage)} utilisés{quota ? ` sur ${formaterOctets(quota)} disponibles` : ''}
          </div>
        )}
      </div>
    </div>
  );
}