export interface Reusifiable {
  next: this | null
}

/**
 * Repool is a class that allows you to reuse objects.
 *
 * Do not use this to store class instances, please use https://github.com/mcollina/reusify instead.
 */
export class Repool<T extends Reusifiable> {
  private head: T;
  private tail: T;

  constructor(private createObject: () => T) {
    const obj = createObject();
    this.tail = obj;
    this.head = obj;
  }

  public get(): T {
    const current = this.head;

    if (current.next) {
      this.head = current.next;
    } else {
      const obj = this.createObject();
      this.tail = obj;
      this.head = obj;
    }

    current.next = null;

    return current;
  }

  public release(obj: T): void {
    this.tail.next = obj;
    this.tail = obj;
  }
}
