import { ValueObject } from './value-object';

abstract class DateValueObject extends ValueObject {
  readonly value: Date;

  constructor(value: Date) {
    super();
    this.value = value;
  }

  public toString(): string {
    return this.value.toUTCString();
  }
}

export { DateValueObject };
