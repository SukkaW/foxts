class Node extends Map<string, Node> {
  constructor(
    public wordEnd: boolean,
    public fail: Node | undefined
  ) {
    super();
  }
}

export function createAhoCorasick(keys: string[] | Set<string> | readonly string[]) {
  const root = new Node(false, undefined);

  // Create a trie with extra fields and information
  const put = (key: string) => {
    let node = root;

    for (let idx = 0, len = key.length; idx < len; idx++) {
      const char = key[idx];

      if (node.has(char)) {
        node = node.get(char)!;
      } else {
        const newNode = new Node(false, undefined);
        node.set(char, newNode);
        node = newNode;
      }
    }

    // If a new node is created, mark it as a word end when loop finish
    if (node !== root) {
      node.wordEnd = true;
    }
  };

  keys.forEach(put);

  // const build = () => {
  // Breadth-first: a node's fail link is derived from its parent's, so the
  // parent must be fully resolved before its children are visited.
  const queue: Node[] = [root];
  let head = 0;

  while (head < queue.length) {
    const beginNode = queue[head++];

    beginNode.forEach((node, char) => {
      let failNode = beginNode.fail;

      while (failNode && !failNode.has(char)) {
        failNode = failNode.fail;
      }

      node.fail = failNode
        ? failNode.get(char)
        : root;

      // A node also terminates a word when any node on its failure chain does
      // (e.g. keys ['Y', '^Ya^'] must match '^Y' at the '^Y' node). Propagating
      // here, in BFS order, keeps the match loop a single wordEnd test.
      if (node.fail?.wordEnd) {
        node.wordEnd = true;
      }

      queue.push(node);
    });
  }
  // };
  // build();

  return (text: string) => {
    let node: Node | undefined = root;

    for (let i = 0, textLen = text.length; i < textLen; i++) {
      const char = text[i];

      while (node && !node.has(char)) {
        node = node.fail;
      }

      node = node ? node.get(char)! : root;

      if (node.wordEnd) {
        return true;
      }
    }

    return false;
  };
}
