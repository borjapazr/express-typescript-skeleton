import { v4, validate } from 'uuid';

import { InvalidParameterException } from '@domain/shared/exceptions';

import { StringValueObject } from './string-value-object';

class Uuid extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureValueIsValid(value);
  }

  public static random(): Uuid {
    return new Uuid(v4());
  }

  private ensureValueIsValid(value: string): void {
    if (!validate(value)) {
      throw new InvalidParameterException(`<${this.constructor.name}> does not allow the value <${value}>`);
    }
  }
}

export { Uuid };
