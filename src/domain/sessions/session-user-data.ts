import { CompositeValueObject } from '@domain/shared/value-object';

class SessionUserData extends CompositeValueObject {
  readonly username: string;

  readonly email: string;

  readonly roles: string[];

  constructor(username: string, email: string, roles: string[]) {
    super();
    this.username = username;
    this.email = email;
    this.roles = roles;
  }
}

export { SessionUserData };
