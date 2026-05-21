import { useState } from 'react';
import { Check, ChevronDown, Wine, Cookie, UtensilsCrossed, PenLine } from 'lucide-react';
import { COULEURS_PAYS, COULEURS_TYPE, couleursDuPlat } from '../donnees/constantes';

const ICONE_TYPE = {
  'Plat': UtensilsCrossed,
  'Boisson': Wine,
  'Dessert': Cookie,
};

/**
 * CartePlat
 *
 * Props :
 *   plat         — objet plat depuis gastronomie.json
 *   avis         — objet avis depuis la DB (undefined si pas encore goûté)
 *   onAjouter    — ({ platNom, avis }) => enregistre un avis
 */
function CartePlat({ plat, avis, onAjouter }) {
  const [ouvert, setOuvert] = useState(false);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [texteAvis, setTexteAvis] = useState('');
  const [enCours, setEnCours] = useState(false);

  const cPays = couleursDuPlat(plat);
  const cType = COULEURS_TYPE[plat.type] || COULEURS_TYPE['Plat'];
  const Icone = ICONE_TYPE[plat.type] || UtensilsCrossed;

  const teste = avis !== undefined;

  const handleAjouter = async () => {
    if (!texteAvis.trim()) return;
    setEnCours(true);
    try {
      await onAjouter({ platNom: plat.nom, avis: texteAvis.trim() });
      setFormulaireOuvert(false);
      setTexteAvis('');
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div
      className="bg-terra-100 border border-[#D9CDB5] rounded-xl mb-2 overflow-hidden relative"
      style={{ borderLeftWidth: 0 }}
    >
      {/* Barre verticale colorée par pays */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ backgroundColor: cPays.barre }}
      />

      {/* ─── Ligne principale ─── */}
      <button
        onClick={() => {
          setOuvert((v) => !v);
          // Ferme le formulaire si on replie la carte
          if (ouvert) setFormulaireOuvert(false);
        }}
        className="w-full flex items-start gap-2.5 pl-4 pr-3.5 py-2.5 text-left"
      >
        {/* Icône ronde colorée par pays */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: cPays.iconBg, color: cPays.iconText }}
        >
          <Icone className="w-[18px] h-[18px]" strokeWidth={2} />
        </div>

        {/* Bloc texte : nom + (pays · pastille type) */}
        <div className="flex-1 min-w-0">
          <div
            className="font-serif text-[17px] leading-tight font-semibold mb-1"
            style={{ color: '#3C2814' }}
          >
            {plat.nom}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px]" style={{ color: '#8B6F4E' }}>
              {plat.pays.join(' · ')}
            </span>
            <span
              className="text-white text-[10px] font-medium px-2 py-0.5 rounded-md"
              style={{ backgroundColor: cType }}
            >
              {plat.type}
            </span>
          </div>
        </div>

        {/* Pastille statut */}
        <div
          className="w-2 h-2 rounded-full flex-shrink-0 mt-3"
          style={{
            backgroundColor: teste ? '#6B8E4E' : '#C8763D',
            opacity: teste ? 1 : 0.4,
          }}
        />

        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 mt-3 transition-transform ${
            ouvert ? 'rotate-180' : ''
          }`}
          style={{ color: '#8B6F4E' }}
          strokeWidth={2}
        />
      </button>

      {/* ─── Déroulé ─── */}
      {ouvert && (
        <div className="pl-4 pr-3.5 pb-3.5 pt-1">
          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-3 text-justify"
            style={{ color: '#5C4A35' }}
          >
            {plat.description}
          </p>

          {/* Anecdote */}
          {plat.anecdote && (
            <div
              className="rounded-md px-3 py-2 mb-3 relative font-serif italic text-[12px] leading-relaxed pl-6 text-justify"
              style={{ backgroundColor: '#F0E5D0', color: '#5C4A35' }}
            >
              <span
                className="absolute left-2 top-0.5 text-2xl not-italic font-serif leading-none"
                style={{ color: cPays.accent }}
              >
                «
              </span>
              {plat.anecdote}
            </div>
          )}

          {teste && (
            <div className="bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-3 mb-3">
              <div className="text-[10px] uppercase tracking-wider text-emerald-700 mb-1.5">
                Mon avis
              </div>
              <p className="font-serif text-sm italic text-terra-900/80 leading-relaxed">
                « {avis.avis} »
              </p>
            </div>
          )}

          {/* ─── Formulaire avis ─── */}
          {!teste && !formulaireOuvert && (
            <button
              onClick={() => setFormulaireOuvert(true)}
              className="w-full bg-terra-500 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              Je l'ai goûté !
            </button>
          )}

          {!teste && formulaireOuvert && (
            <div className="bg-white border border-terra-border rounded-xl p-3 flex flex-col gap-2.5">
              <div className="text-[10px] uppercase tracking-wider text-terra-muted flex items-center gap-1">
                <PenLine className="w-3 h-3" strokeWidth={2} />
                Mon avis
              </div>

              <textarea
                value={texteAvis}
                onChange={(e) => setTexteAvis(e.target.value)}
                placeholder="Ce que tu en as pensé…"
                rows={3}
                className="w-full bg-terra-100 border border-terra-border rounded-lg px-3 py-2 text-sm text-terra-900 placeholder:text-terra-muted outline-none focus:border-terra-500 transition-colors resize-none"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormulaireOuvert(false);
                    setTexteAvis('');
                  }}
                  className="flex-1 bg-terra-100 border border-terra-border text-terra-muted rounded-lg py-2 text-xs"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAjouter}
                  disabled={enCours || !texteAvis.trim()}
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

export default CartePlat;