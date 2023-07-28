import { deepEqual } from 'fast-equals';

abstract class CompositeValueObject {
  public equalsTo(other: CompositeValueObject): boolean {
    return other.constructor.name === this.constructor.name && deepEqual(this, other);
  }

  public toString(): string {
    return JSON.stringify(this);
  }
}

export { CompositeValueObject };
