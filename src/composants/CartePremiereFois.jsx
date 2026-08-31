import { useState } from 'react';
import {
  Check,
  ChevronDown,
  Trash2,
  PenLine,
  Calendar,
  Footprints,
  UtensilsCrossed,
  PartyPopper,
  HelpCircle,
} from 'lucide-react';
import { COULEURS_DEFI } from '../donnees/constantes';

const ICONE_TYPE_DEFI = {
  Sport: Footprints,
  Gastronomie: UtensilsCrossed,
  Absurde: PartyPopper,
  'À définir': HelpCircle,
};

/**
 * CartePremiereFois
 *
 * Props :
 *   premiere     — objet depuis premieresFois.json (nom, type, description?)
 *   commentaire  — enregistrement { id, nom, commentaire, date } depuis la DB, ou undefined si pas fait
 *   onMarquer    — ({ nom, commentaire }) => enregistre le défi comme fait
 *   onSupprimer  — (id) => supprime l'enregistrement (repasse en "pas fait")
 */
function CartePremiereFois({ premiere, commentaire, onMarquer, onSupprimer }) {
  const [ouvert, setOuvert] = useState(false);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [texte, setTexte] = useState('');
  const [enCours, setEnCours] = useState(false);

  const aDescription = Boolean(premiere.description);
  const fait = commentaire !== undefined;

  const type = premiere.type || 'À définir';
  const couleurs = COULEURS_DEFI[type] || COULEURS_DEFI['À définir'];
  const Icone = ICONE_TYPE_DEFI[type] || HelpCircle;

  const dateFormatee = commentaire?.date
    ? new Date(commentaire.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const handleConfirmer = async () => {
    setEnCours(true);
    try {
      await onMarquer({ nom: premiere.nom, commentaire: texte.trim() });
      setFormulaireOuvert(false);
      setTexte('');
    } finally {
      setEnCours(false);
    }
  };

  const handleSupprimer = async () => {
    if (commentaire) await onSupprimer(commentaire.id);
  };

  return (
    <div className="bg-terra-100 border border-terra-border rounded-xl mb-2 overflow-hidden relative">
      {/* Barre verticale colorée par type */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ backgroundColor: couleurs.barre }}
      />

      {/* ─── Ligne principale (toujours visible) ─── */}
      <button
        onClick={() => {
          setOuvert((v) => !v);
          if (ouvert) setFormulaireOuvert(false);
        }}
        className="w-full flex items-center gap-2.5 pl-4 pr-3.5 py-2.5 text-left"
      >
        {/* Icône ronde colorée par type */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: couleurs.badgeBg, color: couleurs.badgeText }}
        >
          <Icone className="w-[18px] h-[18px]" strokeWidth={2} />
        </div>

        {/* Bloc texte */}
        <div className="flex-1 min-w-0">
          <div className="font-serif text-[16px] text-terra-900 leading-tight">
            {premiere.nom}
          </div>
          <span
            className="inline-block mt-1 text-white text-[10px] font-medium px-2 py-0.5 rounded-md"
            style={{ backgroundColor: couleurs.barre }}
          >
            {type}
          </span>
        </div>

        {/* Pastille rouge / verte (statut fait) */}
        <div
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            fait ? 'bg-emerald-500' : 'bg-red-400'
          }`}
        />

        <ChevronDown
          className={`w-4 h-4 text-terra-muted transition-transform flex-shrink-0 ${
            ouvert ? 'rotate-180' : ''
          }`}
          strokeWidth={2}
        />
      </button>

      {/* ─── Déroulé (visible si ouvert) ─── */}
      {ouvert && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-terra-border/50">
          {aDescription && (
            <p className="text-sm text-terra-900 leading-relaxed mb-3">
              {premiere.description}
            </p>
          )}

          {/* Commentaire enregistré */}
          {fait && (
            <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[10px] uppercase tracking-wider text-emerald-700">
                  Mon commentaire
                </div>
                <button
                  onClick={handleSupprimer}
                  className="text-terra-muted hover:text-red-400 transition-colors"
                  title="Supprimer (pour modifier)"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
              {dateFormatee && (
                <div className="flex items-center gap-1.5 text-xs text-terra-900/70 mb-1.5">
                  <Calendar className="w-3 h-3" strokeWidth={2} />
                  <span>{dateFormatee}</span>
                </div>
              )}
              {commentaire.commentaire && (
                <p className="font-serif text-sm italic text-terra-900/80 leading-relaxed">
                  « {commentaire.commentaire} »
                </p>
              )}
            </div>
          )}

          {/* Bouton Fait / Marquer comme fait */}
          {!fait && !formulaireOuvert && (
            <button
              onClick={() => setFormulaireOuvert(true)}
              className="w-full rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 bg-terra-500 text-white"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              Marquer comme fait
            </button>
          )}

          {!fait && formulaireOuvert && (
            <div className="bg-white border border-terra-border rounded-xl p-3 flex flex-col gap-2.5">
              <div className="text-[10px] uppercase tracking-wider text-terra-muted flex items-center gap-1">
                <PenLine className="w-3 h-3" strokeWidth={2} />
                Mon commentaire <span className="text-terra-muted/60">(facultatif)</span>
              </div>

              <textarea
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                placeholder="Ce que tu en as pensé…"
                rows={3}
                className="w-full bg-terra-100 border border-terra-border rounded-lg px-3 py-2 text-sm text-terra-900 placeholder:text-terra-muted outline-none focus:border-terra-500 transition-colors resize-none"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormulaireOuvert(false);
                    setTexte('');
                  }}
                  className="flex-1 bg-terra-100 border border-terra-border text-terra-muted rounded-lg py-2 text-xs"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmer}
                  disabled={enCours}
                  className="flex-1 bg-terra-500 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  {enCours ? 'Enregistrement…' : 'Confirmer'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CartePremiereFois;