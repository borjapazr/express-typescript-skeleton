import { deepEqual } from 'fast-equals';

import { InvalidParameterException } from '@domain/shared/exceptions';

type Primitive = bigint | number | boolean | string | Date | symbol;

abstract class ValueObject<T extends Primitive> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
    this.ensureValueIsDefined(value);
  }

  public equalsTo(other: ValueObject<T>): boolean {
    return other.constructor.name === this.constructor.name && other.value === this.value && deepEqual(this, other);
  }

  public toString(): string {
    return this.value.toString();
  }

  private ensureValueIsDefined(value: T): void {
    if (value === null || value === undefined) {
      throw new InvalidParameterException('Value must be provided');
    }
  }
}

export { ValueObject };
