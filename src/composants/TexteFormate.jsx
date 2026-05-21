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
 * Le composant rend le texte SANS HTML brut (pas de dangerouslySetInnerHTML),
 * donc c'est sûr même si un jour le contenu venait d'ailleurs.
 */
function TexteFormate({ texte }) {
  if (!texte) return null;

  // ─── Le parseur ────────────────────────────────────────────────────────
  // On découpe le texte en morceaux : du texte brut OU des morceaux formatés.
  // L'astuce : une regex qui capture les 3 patterns en une seule passe,
  // avec leur contenu entre les marqueurs.
  //
  // Le regex :
  //   \*\*(.+?)\*\*   → **gras** (le .+? est "non gourmand", il s'arrête au 1er **)
  //   __(.+?)__       → __souligné__
  //   \*(.+?)\*       → *italique* (à mettre EN DERNIER, sinon ça mangerait les **)
  //
  // On utilise split() avec la regex pour découper le texte en :
  //   [texte_avant, contenu_gras, texte_milieu, contenu_souligne, texte_après, ...]
  //
  // Chaque "morceau capturé" se retrouve entre les morceaux de texte brut.

  const regex = /\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*/g;
  const morceaux = [];
  let dernierIndex = 0;
  let match;

  while ((match = regex.exec(texte)) !== null) {
    // Ajoute le texte brut entre le dernier match et celui-ci
    if (match.index > dernierIndex) {
      morceaux.push({
        type: 'texte',
        contenu: texte.slice(dernierIndex, match.index),
      });
    }

    // Détermine quel type de formatage on a capturé
    if (match[1] !== undefined) {
      // match[1] = contenu de **xxx**
      morceaux.push({ type: 'gras', contenu: match[1] });
    } else if (match[2] !== undefined) {
      // match[2] = contenu de __xxx__
      morceaux.push({ type: 'souligne', contenu: match[2] });
    } else if (match[3] !== undefined) {
      // match[3] = contenu de *xxx*
      morceaux.push({ type: 'italique', contenu: match[3] });
    }

    dernierIndex = match.index + match[0].length;
  }

  // Ajoute le texte brut restant après le dernier match
  if (dernierIndex < texte.length) {
    morceaux.push({ type: 'texte', contenu: texte.slice(dernierIndex) });
  }

  // ─── Rendu ─────────────────────────────────────────────────────────────
  return (
    <>
      {morceaux.map((morceau, i) => {
        if (morceau.type === 'gras') {
          return (
            <strong key={i} className="font-semibold text-terra-900">
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
        // type === 'texte'
        return <span key={i}>{morceau.contenu}</span>;
      })}
    </>
  );
}

export default TexteFormate;