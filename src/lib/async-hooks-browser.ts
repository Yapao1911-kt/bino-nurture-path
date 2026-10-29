export class AsyncLocalStorage<T = any> {
  private store: T | undefined = undefined;

  getStore(): T | undefined {
    return this.store;
  }

  run<R>(store: T, callback: (...args: any[]) => R, ...args: any[]): R {
    const prev = this.store;
    this.store = store;
    try {
      const result = callback(...args);
      if (result && typeof (result as any).then === "function") {
        return (result as any).finally(() => {
          this.store = prev;
        });
      }
      this.store = prev;
      return result;
    } catch (error) {
      this.store = prev;
      throw error;
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
