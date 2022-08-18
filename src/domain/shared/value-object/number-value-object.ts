import { ValueObject } from './value-object';

abstract class NumberValueObject extends ValueObject {
  readonly value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  public isBiggerThan(other: NumberValueObject): boolean {
    return this.value > other.value;
  }

  public toString(): string {
    return this.value.toString();
  }
}

export { NumberValueObject };
