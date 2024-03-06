import { CompositeValueObject } from '@shared/domain/value-object';

class UserName extends CompositeValueObject {
  readonly firstName: string;

  readonly lastName: string;

  constructor(firstName: string, lastName: string) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

export { UserName };
