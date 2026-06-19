import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, BookOpen, Search, X } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import CarteEntreeJournal from '../composants/CarteEntreeJournal';
import { moisAnnee } from '../utils/dates';

// Normalisation pour une recherche insensible aux accents et à la casse.
const normaliser = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// ═══════════════════════════════════════════════════════════════════════════
// JournalBord — la timeline du voyage (style Polarsteps, hors-ligne).
// ═══════════════════════════════════════════════════════════════════════════
function JournalBord() {
  const navigate = useNavigate();
  const { entrees } = useJournal();
  const [chrono, setChrono] = useState(true); // true = du début à la fin
  const [recherche, setRecherche] = useState('');

  const q = normaliser(recherche.trim());

  // Filtre sur titre + lieu + récit
  const filtrees = useMemo(() => {
    if (!q) return entrees;
    return entrees.filter((e) =>
      normaliser(`${e.titre} ${e.lieu} ${e.texte}`).includes(q)
    );
  }, [entrees, q]);

  // entrees arrive « plus récent d'abord » : on inverse si tri chrono.
  const liste = useMemo(
    () => (chrono ? [...filtrees].reverse() : filtrees),
    [filtrees, chrono]
  );

  // Regroupement par mois (désactivé pendant une recherche)
  const groupes = useMemo(() => {
    if (q) return [{ mois: null, entrees: liste }];
    const res = [];
    let courant = null;
    for (const e of liste) {
      const m = moisAnnee(e.dateDebut);
      if (!courant || courant.mois !== m) {
        courant = { mois: m, entrees: [] };
        res.push(courant);
      }
      courant.entrees.push(e);
    }
    return res;
  }, [liste, q]);

  const total = entrees.length;

  return (
    <div className="p-4 pb-10">
      {/* Bouton retour */}
      <Link to="/journal" className="flex items-center gap-2 text-terra-500 mb-3">
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </Link>

      {/* En-tête */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <h1 className="text-3xl font-serif text-terra-900 leading-tight">
            Journal de bord
          </h1>
          <div className="text-[10px] uppercase tracking-wider text-terra-muted mt-0.5">
            {total} étape{total !== 1 ? 's' : ''} de notre traversée
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {total > 1 && (
            <button
              onClick={() => setChrono((c) => !c)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-terra-100 text-terra-muted border border-terra-border"
            >
              {chrono ? 'Chrono' : 'Récent'}
            </button>
          )}
          {/* Bouton « + » fiable, dans le flux normal (jamais masqué) */}
          <button
            onClick={() => navigate('/journal/bord/nouveau')}
            className="w-9 h-9 rounded-full bg-terra-500 text-white flex items-center justify-center shadow-sm flex-shrink-0"
            aria-label="Nouvelle étape"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Recherche (apparaît au-delà de quelques entrées) */}
      {total > 3 && (
        <div className="flex items-center gap-2 bg-terra-100 border border-terra-border rounded-xl px-3.5 py-2 mb-4">
          <Search className="w-4 h-4 text-terra-muted" strokeWidth={2} />
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Titre, lieu, mot du récit…"
            className="flex-1 bg-transparent outline-none text-sm text-terra-900 placeholder:text-terra-muted min-w-0"
          />
          {recherche && (
            <button
              onClick={() => setRecherche('')}
              className="text-terra-muted hover:text-terra-500 flex-shrink-0"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          )}
        </div>
      )}

      {/* Liste / états vides */}
      {total === 0 ? (
        <div className="text-center py-16 px-6">
          <BookOpen
            className="w-12 h-12 mx-auto text-terra-muted/50 mb-3"
            strokeWidth={1.5}
          />
          <p className="font-serif text-lg text-terra-900 mb-1">
            Le carnet est encore vierge
          </p>
          <p className="text-sm text-terra-muted mb-5">
            Note ta première étape : une date, un titre, quelques mots et des
            photos.
          </p>
          <Link
            to="/journal/bord/nouveau"
            className="inline-flex items-center gap-2 bg-terra-500 text-white rounded-xl px-5 py-3 text-sm font-medium"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Créer une étape
          </Link>
        </div>
      ) : liste.length === 0 ? (
        <div className="text-center py-10 text-terra-muted text-sm">
          Aucune étape ne correspond à « {recherche} »
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {groupes.map((g, gi) => (
            <div key={gi} className="flex flex-col gap-2">
              {g.mois && (
                <div className="text-[11px] font-semibold uppercase tracking-wider text-terra-muted px-1 pt-1">
                  {g.mois}
                </div>
              )}
              {g.entrees.map((entree) => (
                <CarteEntreeJournal key={entree.id} entree={entree} />
              ))}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default JournalBord;