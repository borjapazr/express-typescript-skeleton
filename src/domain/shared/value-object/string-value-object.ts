import { ValueObject } from './value-object';

abstract class StringValueObject extends ValueObject {
  readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }
}

export { StringValueObject };
