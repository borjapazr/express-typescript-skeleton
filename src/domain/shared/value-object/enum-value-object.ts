import { ValueObject } from './value-object';

abstract class EnumValueObject<T> extends ValueObject {
  readonly value: T;

  constructor(value: T, public readonly validValues: T[]) {
    super();
    this.checkIfValueIsValid(value);
    this.value = value;
  }

  public checkIfValueIsValid(value: T): void {
    if (!this.validValues.includes(value)) {
      this.throwErrorForInvalidValue(value);
    }
  }

  protected abstract throwErrorForInvalidValue(value: T): void;
}

export { EnumValueObject };
