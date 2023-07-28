import { ValueObject } from './value-object';

abstract class StringValueObject extends ValueObject<string> {
  public toString(): string {
    return this.value;
  }
}

export { StringValueObject };
