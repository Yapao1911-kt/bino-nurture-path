export class AsyncLocalStorage<T = any> {
  private store: T | undefined = undefined;

  getStore(): T | undefined {
    return this.store;
  }

  run<R>(store: T, callback: (...args: any[]) => R, ...args: any[]): R {
    const prev = this.store;
    this.store = store;
    try {
      return callback(...args);
    } finally {
      this.store = prev;
    }
  }

  enterWith(store: T): void {
    this.store = store;
  }

  disable(): void {
    this.store = undefined;
  }
}

export default {
  AsyncLocalStorage,
};
