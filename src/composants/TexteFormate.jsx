/**
 * Composant qui affiche du texte avec un mini-formatage type Markdown.
 *
 * Syntaxe supportée :
 *   **gras**         → <strong>gras</strong>
 *   *italique*       → <em>italique</em>
 *   __souligné__     → <u>souligné</u>
 *
 * Usage :
 *   <TexteFormate texte="Le **Machu Picchu** est *incroyable*." />
 *
 * Le gras n'impose plus de couleur : il hérite de celle du contexte
 * (text-terra-900 dans les activités, text-encre dans les enquêtes…).
 */
function TexteFormate({ texte }) {
  if (!texte) return null;

  const regex = /\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*/g;
  const morceaux = [];
  let dernierIndex = 0;
  let match;

  while ((match = regex.exec(texte)) !== null) {
    // Texte brut entre le dernier match et celui-ci
    if (match.index > dernierIndex) {
      morceaux.push({
        type: 'texte',
        contenu: texte.slice(dernierIndex, match.index),
      });
    }

    if (match[1] !== undefined) {
      morceaux.push({ type: 'gras', contenu: match[1] });
    } else if (match[2] !== undefined) {
      morceaux.push({ type: 'souligne', contenu: match[2] });
    } else if (match[3] !== undefined) {
      morceaux.push({ type: 'italique', contenu: match[3] });
    }

    dernierIndex = match.index + match[0].length;
  }

  // Texte brut restant
  if (dernierIndex < texte.length) {
    morceaux.push({ type: 'texte', contenu: texte.slice(dernierIndex) });
  }

  return (
    <>
      {morceaux.map((morceau, i) => {
        if (morceau.type === 'gras') {
          return (
            <strong key={i} className="font-semibold">
              {morceau.contenu}
            </strong>
          );
        }
        if (morceau.type === 'italique') {
          return <em key={i}>{morceau.contenu}</em>;
        }
        if (morceau.type === 'souligne') {
          return (
            <u key={i} className="underline decoration-terra-500 underline-offset-2">
              {morceau.contenu}
            </u>
          );
        }
        return <span key={i}>{morceau.contenu}</span>;
      })}
    </>
  );
}

export default TexteFormate;