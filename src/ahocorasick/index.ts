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
  const queue: Node[] = [root];

  while (queue.length) {
    const beginNode = queue.pop()!;

    beginNode.forEach((node, char) => {
      let failNode = beginNode.fail;

      while (failNode && !failNode.has(char)) {
        failNode = failNode.fail;
      }

      node.fail = failNode
        ? failNode.get(char)
        : root;

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
