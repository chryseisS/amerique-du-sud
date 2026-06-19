import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, BookOpen, Search, X } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import CarteEntreeJournal from '../composants/CarteEntreeJournal';
import { moisAnnee } from '../utils/dates';

const normaliser = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function JournalBord() {
  const navigate = useNavigate();
  const { entrees } = useJournal();
  const [chrono, setChrono] = useState(true);
  const [recherche, setRecherche] = useState('');

  const q = normaliser(recherche.trim());

  const filtrees = useMemo(() => {
    if (!q) return entrees;
    return entrees.filter((e) =>
      normaliser(`${e.titre} ${e.lieu} ${e.texte}`).includes(q)
    );
  }, [entrees, q]);

  const liste = useMemo(
    () => (chrono ? [...filtrees].reverse() : filtrees),
    [filtrees, chrono]
  );

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
    <div className="pb-10">

      {/* ─── HERO ─── */}
      <div className="relative h-28 overflow-hidden px-4 flex flex-col justify-between py-4">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/journal/header_journal.png')",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 95%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 95%, transparent 100%)',
          }}
        />

        {/* Bouton retour — haut gauche, couleur terra */}
        <Link
          to="/journal"
          className="relative flex items-center gap-1.5 text-terra-500 z-10 w-fit"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          <span className="text-sm">Retour</span>
        </Link>

        {/* Titre — bas du hero */}
        <div className="relative">
          <h1 className="text-3xl font-serif font-semibold text-terra-900 tracking-tight leading-tight">
            Journal de bord
          </h1>
          <p className="text-sm text-terra-muted mt-0.5 italic">
            {total === 0
              ? 'Commence à écrire ton aventure'
              : `${total} étape${total !== 1 ? 's' : ''} de notre traversée`}
          </p>
        </div>
      </div>

      {/* ─── BOUTON « + » à cheval sur le hero ─── */}
      <div className="flex justify-center -mt-6 mb-1 relative z-10">
        <button
          onClick={() => navigate('/journal/bord/nouveau')}
          className="w-12 h-12 rounded-full bg-terra-500 text-white flex items-center justify-center shadow-md animate-pulse-scale"
          aria-label="Nouvelle étape"
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </button>
      </div>

      {/* ─── CHRONO — gauche, juste sous le + ─── */}
      {total > 1 && (
        <div className="px-4 pt-0 -mt-4 pb-1">
          <button
            onClick={() => setChrono((c) => !c)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-terra-100 text-terra-muted border border-terra-border"
          >
            {chrono ? 'Chrono ↑' : 'Récent ↓'}
          </button>
        </div>
      )}

      {/* ─── CONTENU ─── */}
      <div className="px-4">

        {/* Recherche */}
        {total > 3 && (
          <div className="flex items-center gap-2 bg-terra-100 border border-terra-border rounded-xl px-3.5 py-2 mb-4">
            <Search className="w-4 h-4 text-terra-muted flex-shrink-0" strokeWidth={2} />
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Titre, lieu, mot du récit…"
              className="flex-1 bg-transparent outline-none text-sm text-terra-900 placeholder:text-terra-muted min-w-0"
            />
            {recherche && (
              <button onClick={() => setRecherche('')} className="text-terra-muted flex-shrink-0">
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            )}
          </div>
        )}

        {total === 0 ? (
          <div className="text-center py-14 px-6">
            <BookOpen className="w-12 h-12 mx-auto text-terra-muted/50 mb-3" strokeWidth={1.5} />
            <p className="font-serif text-lg text-terra-900 mb-1">
              Le carnet est encore vierge
            </p>
            <p className="text-sm text-terra-muted mb-5">
              Note ta première étape : une date, un titre, quelques mots et des photos.
            </p>
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
    </div>
  );
}

export default JournalBord;