import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import pays from '../donnees/pays.json';
import { COULEURS_PAYS } from '../donnees/constantes';
import Accordeon from '../composants/Accordeon';

function DetailPays() {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = pays.find((x) => x.id === id);

  const couleurs = COULEURS_PAYS?.[p?.nom] || { accent: 'var(--color-terra-900, #7c2d12)' };

  if (!p) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4 text-terra-500" strokeWidth={2} />
          <span className="text-sm text-terra-500">Retour</span>
        </button>
        <p className="text-terra-muted">Pays introuvable.</p>
      </div>
    );
  }

  return (
    <div className="p-4">

      {/* ─── TITRE AVEC FLÈCHE RETOUR INTÉGRÉE ─── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div
            className="flex items-center gap-3 active:opacity-70 transition cursor-pointer"
            onClick={() => navigate(-1)}
          >
            {/* Flèche de la couleur du pays */}
            <ArrowLeft
              className="w-6 h-6 flex-shrink-0"
              strokeWidth={2.5}
              style={{ color: couleurs.accent }}
            />

            <h1
              className="font-serif text-3xl font-semibold leading-tight tracking-wide"
              style={{ color: couleurs.accent }}
            >
              {p.nom}
            </h1>
          </div>

          {/* Ligne d'accentuation calée sous le début du texte */}
          <div
            className="h-[2px] w-8 mt-3.5 ml-9 rounded-full"
            style={{ backgroundColor: couleurs.accent }}
          />
        </div>
      </div>

      {/* ─── ACCORDÉONS ─── */}
      {p.sections && p.sections.length > 0 ? (
        <div className="border-t border-terra-border text-justify">
          {p.sections.map((section, i) => (
            <Accordeon
              key={i}
              titre={section.titre}
              contenu={section.contenu}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-terra-muted">
          Aucune information disponible pour ce pays.
        </p>
      )}

    </div>
  );
}

export default DetailPays;