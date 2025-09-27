export function emptyNodeLegacy(node: Node) {
  while (node.firstChild) { // get first child is always faster
    // remove last child is way faster (pop always faster than shift)
    node.removeChild(node.lastChild!);
  }
}

export function emptyNodeModern(node: Element) {
  node.replaceChildren();
}

/**
 * Use `Element.replaceChildren` if available, otherwise fall back to removing each child node.
 */
export const emptyNode = typeof Element !== 'undefined' && 'replaceChildren' in Element.prototype
  ? emptyNodeModern
  : emptyNodeLegacy;
