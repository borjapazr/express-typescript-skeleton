import { ValueObject } from '@domain/shared/value-object';

class SessionUserData extends ValueObject {
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
