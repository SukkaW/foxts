type Node<T> = [value: T, next: Node<T> | null];

export class FIFO<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  public $size = 0;

  constructor() {
    this.clear();
  }

  enqueue(value: T) {
    const node: Node<T> = [value, null];

    if (this.head) {
      this.tail![1] = node;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }

    this.$size++;
  }

  dequeue() {
    const current = this.head;
    if (!current) {
      return;
    }

    this.head = this.head![1];
    this.$size--;
    return current[0];
  }

  peek() {
    return this.head?.[0];
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.$size = 0;
  }

  get size() {
    return this.$size;
  }

  *[Symbol.iterator]() {
    let current = this.head;

    while (current) {
      yield current[0];
      current = current[1];
    }
  }
}