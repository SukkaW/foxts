/**
 * if you are trying to empty an Element, use `emptyElement` method instead, it will opt-in more performant method on modern browsers.
 */
export function emptyNode(node: Node) {
  while (node.firstChild) { // get first child is always faster
    // remove last child is way faster (pop always faster than shift)
    node.removeChild(node.lastChild!);
  }
}

export function emptyElementModern(element: Element) {
  element.replaceChildren();
}

/**
 * Use `Element.replaceChildren` if available, otherwise fall back to removing each child node.
 */
export const emptyElement: (element: Element) => void = typeof Element !== 'undefined' && 'replaceChildren' in Element.prototype
  ? emptyElementModern
  : emptyNode;
