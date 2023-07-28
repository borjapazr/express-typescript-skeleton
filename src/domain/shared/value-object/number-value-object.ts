import { ValueObject } from './value-object';

abstract class NumberValueObject extends ValueObject<number> {
  public isBiggerThan(other: NumberValueObject): boolean {
    return this.value > other.value;
  }

  public toString(): string {
    return this.value.toString();
  }
}

export { NumberValueObject };
