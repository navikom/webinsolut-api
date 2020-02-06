function Fix(target: any): void {
  return class extends target {
    constructor(...args: any[]) {
      super(...args);
      Object.keys(new.target.rawAttributes).forEach(propertyKey => {
        Object.defineProperty(this, propertyKey, {
          get() {
            return this.getDataValue(propertyKey);
          },
          set(value) {
            this.setDataValue(propertyKey, value);
          }
        });
      });
    }
  } as any;
}
