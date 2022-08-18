import { deepEqual } from 'fast-equals';

abstract class ValueObject {
  public equalsTo(other: ValueObject): boolean {
    return deepEqual(this, other);
  }

  public toString(): string {
    return JSON.stringify(this);
  }
}

export { ValueObject };
