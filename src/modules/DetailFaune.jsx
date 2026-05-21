import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, MapPin, Calendar, Trash2, PenLine } from 'lucide-react';
import faune from '../donnees/faune.json';
import { RARETE_LIBELLES, versSlug } from '../donnees/constantes';
import Accordeon from '../composants/Accordeon';
import { useObservationsFaune } from '../hooks/useObservationsFaune';

function DetailFaune() {
  const { slug } = useParams();
  const animal = faune.find((a) => versSlug(a.nom) === slug);

  const { observationDe, marquerVu, supprimerObservation } = useObservationsFaune();

  // Formulaire d'observation
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [lieu, setLieu] = useState('');
  const [note, setNote] = useState('');
  const [enCours, setEnCours] = useState(false);

  if (!animal) {
    return (
      <div className="p-4">
        <Link to="/journal/faune" className="flex items-center gap-2 text-terra-500 mb-4">
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Retour</span>
        </Link>
        <p className="text-terra-muted">Espèce introuvable.</p>
      </div>
    );
  }

  const numero = String(animal.numero).padStart(3, '0');
  const etoiles = '★'.repeat(animal.rarete) + '☆'.repeat(3 - animal.rarete);
  const rareteLibelle = RARETE_LIBELLES[animal.rarete];

  // Observation live depuis la DB
  const observation = observationDe(animal.nom);
  const vu = observation !== undefined;

  const handleMarquerVu = async () => {
    setEnCours(true);
    try {
      await marquerVu({ animalNom: animal.nom, lieu, note });
      setFormulaireOuvert(false);
      setLieu('');
      setNote('');
    } finally {
      setEnCours(false);
    }
  };

  const handleSupprimer = async () => {
    if (observation) {
      await supprimerObservation(observation.id);
    }
  };

  // Formatage de la date
  const dateFormatee = observation?.date
    ? new Date(observation.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="p-4">
      {/* Bouton retour */}
      <Link
        to="/journal/faune"
        className="flex items-center gap-2 text-terra-500 mb-4"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-sm">Retour</span>
      </Link>

      {/* ─── Header ─── */}
      <div className="bg-terra-100 rounded-2xl h-48 flex items-end justify-center relative mb-4 overflow-hidden">
        <span className="absolute top-2.5 left-3 text-[10px] text-terra-muted bg-terra-50/85 px-2 py-0.5 rounded-md z-10">
          N°{numero}
        </span>
        <span
          className={`absolute top-2.5 right-3 text-[10px] px-2 py-0.5 rounded-md z-10 ${
            vu
              ? 'bg-terra-50/85 text-emerald-700'
              : 'bg-terra-50/85 text-terra-500'
          }`}
        >
          {vu ? '✓ vu' : `${etoiles} ${rareteLibelle}`}
        </span>

        {animal.photo ? (
          <img
            src={`/images/faune/${animal.photo}`}
            alt={animal.nom}
            className={`h-44 w-auto object-contain transition-all duration-700 drop-shadow-md ${
              vu ? '' : 'grayscale brightness-0'
            }`}
          />
        ) : (
          <span className="text-8xl mb-4">{animal.emoji}</span>
        )}
      </div>

      {/* Titre */}
      <h1 className="font-serif text-2xl text-terra-900 leading-tight">
        {animal.nom}
      </h1>
      <div className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-terra-100 text-terra-muted mb-4">
        {etoiles} {rareteLibelle}
      </div>

      {/* ─── Bloc observation (si vu) ─── */}
      {vu && (
        <div className="bg-terra-500/10 border border-terra-500/20 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] uppercase tracking-wider text-terra-500">
              Mon observation
            </div>
            <button
              onClick={handleSupprimer}
              className="text-terra-muted hover:text-red-400 transition-colors"
              title="Supprimer l'observation"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-terra-900 mb-1">
            <Calendar className="w-3 h-3" strokeWidth={2} />
            <span>{dateFormatee}</span>
          </div>
          {observation.lieu && (
            <div className="flex items-center gap-2 text-xs text-terra-900 mb-2">
              <MapPin className="w-3 h-3" strokeWidth={2} />
              <span>{observation.lieu}</span>
            </div>
          )}
          {observation.note && (
            <div className="font-serif text-xs italic text-terra-900/80 leading-relaxed">
              « {observation.note} »
            </div>
          )}
        </div>
      )}

      {/* Comment le reconnaître */}
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-wider text-terra-muted mb-1">
          Comment le reconnaître
        </div>
        <p className="text-sm text-terra-900 leading-relaxed text-justify">
          {animal.reconnaitre}
        </p>
      </div>

      {/* Anecdote courte */}
      {animal.anecdoteCourte && (
        <div className="bg-terra-100 border-l-4 border-terra-500 rounded-md p-3 mb-4">
          <p className="font-serif text-sm italic text-terra-900/80 leading-relaxed text-justify">
            « {animal.anecdoteCourte} »
          </p>
        </div>
      )}

      {/* Où le trouver */}
      {animal.ouLeTrouver && animal.ouLeTrouver.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider text-terra-muted mb-2">
            Où le trouver
          </div>
          <div className="flex flex-wrap gap-1.5">
            {animal.ouLeTrouver.map((lieu) => (
              <span
                key={lieu}
                className="text-[11px] px-2 py-1 rounded bg-terra-100 text-terra-500"
              >
                {lieu}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Accordéons */}
      {animal.sections && animal.sections.length > 0 && (
        <div className="border-b border-terra-border mb-4 text-justify">
          {animal.sections.map((section, i) => (
            <Accordeon
              key={i}
              titre={section.titre}
              contenu={section.contenu}
            />
          ))}
        </div>
      )}

      {/* ─── Bouton / Formulaire ─── */}
      {!vu && !formulaireOuvert && (
        <button
          onClick={() => setFormulaireOuvert(true)}
          className="w-full bg-terra-500 text-white rounded-xl py-3 font-medium text-sm flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" strokeWidth={2.5} />
          Je l'ai vu !
        </button>
      )}

      {!vu && formulaireOuvert && (
        <div className="bg-terra-100 border border-terra-border rounded-xl p-4 flex flex-col gap-3">
          <div className="text-[10px] uppercase tracking-wider text-terra-muted flex items-center gap-1">
            <PenLine className="w-3 h-3" strokeWidth={2} />
            Enregistrer mon observation
          </div>

          {/* Lieu */}
          <div>
            <label className="text-[11px] text-terra-muted block mb-1">
              Où ? <span className="text-terra-muted/60">(facultatif)</span>
            </label>
            <input
              type="text"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              placeholder="Ex : Vallée Sacrée, Cuzco"
              className="w-full bg-white border border-terra-border rounded-lg px-3 py-2 text-sm text-terra-900 placeholder:text-terra-muted outline-none focus:border-terra-500 transition-colors"
            />
          </div>

          {/* Note */}
          <div>
            <label className="text-[11px] text-terra-muted block mb-1">
              Note <span className="text-terra-muted/60">(facultatif)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ce que tu as remarqué…"
              rows={3}
              className="w-full bg-white border border-terra-border rounded-lg px-3 py-2 text-sm text-terra-900 placeholder:text-terra-muted outline-none focus:border-terra-500 transition-colors resize-none"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFormulaireOuvert(false);
                setLieu('');
                setNote('');
              }}
              className="flex-1 bg-white border border-terra-border text-terra-muted rounded-xl py-2.5 text-xs"
            >
              Annuler
            </button>
            <button
              onClick={handleMarquerVu}
              disabled={enCours}
              className="flex-1 bg-terra-500 text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              {enCours ? 'Enregistrement…' : 'Confirmer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailFaune;