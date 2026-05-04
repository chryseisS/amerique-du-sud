import { Link } from 'react-router-dom';
import activites from '../donnees/activites.json';
import { versSlug } from '../donnees/constantes';

/**
 * Affiche un texte en paragraphes (séparés par \n\n).
 * Toute mention [[Nom d'activité]] devient un lien cliquable
 * vers la fiche activité correspondante.
 *
 * Si l'activité n'est pas trouvée, le nom s'affiche en italique gris
 * (pour repérer visuellement les références cassées).
 */
function TexteAvecLiens({ texte }) {
  if (!texte) return null;

  return texte.split('\n\n').map((paragraphe, i) => (
    <p
      key={i}
      className="text-sm text-terra-900 leading-relaxed mb-3 text-justify"
    >
      {transformerLiens(paragraphe)}
    </p>
  ));
}

function transformerLiens(texte) {
  // Capture tout ce qui est entre [[ et ]]
  const regex = /\[\[([^\]]+)\]\]/g;
  const morceaux = [];
  let dernierIndex = 0;
  let match;

  while ((match = regex.exec(texte)) !== null) {
    // Texte avant le [[...]]
    if (match.index > dernierIndex) {
      morceaux.push(texte.slice(dernierIndex, match.index));
    }

    const nomActivite = match[1];
    const activite = activites.find((a) => a.nom === nomActivite);

    if (activite) {
      morceaux.push(
        <Link
          key={match.index}
          to={`/planification/activites/${versSlug(activite.nom)}`}
          className="text-terra-500 underline-offset-2 hover:underline"
        >
          {nomActivite}
        </Link>
      );
    } else {
      morceaux.push(
        <span key={match.index} className="text-terra-muted italic">
          {nomActivite}
        </span>
      );
    }

    dernierIndex = match.index + match[0].length;
  }

  if (dernierIndex < texte.length) {
    morceaux.push(texte.slice(dernierIndex));
  }

  return morceaux;
}

export default TexteAvecLiens;