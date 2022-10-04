import { ValueObject } from '@domain/shared/value-object';

class UserName extends ValueObject {
  readonly firstName: string;

  readonly lastName: string;

  constructor(firstName: string, lastName: string) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

export { UserName };
