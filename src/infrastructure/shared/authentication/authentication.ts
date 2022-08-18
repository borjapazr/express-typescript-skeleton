import { Nullable } from '@domain/shared';

class Authentication {
  readonly uuid: Nullable<string>;

  readonly username: Nullable<string>;

  readonly email: Nullable<string>;

  readonly roles: string[];

  constructor(uuid: Nullable<string>, username: Nullable<string>, email: Nullable<string>, roles: string[]) {
    this.uuid = uuid;
    this.username = username;
    this.email = email;
    this.roles = roles;
  }

  public static create(
    uuid: Nullable<string>,
    username: Nullable<string>,
    email: Nullable<string>,
    roles: string[]
  ): Authentication {
    return new Authentication(uuid, username, email, roles);
  }

  public static createEmpty(): Authentication {
    return new Authentication(null, null, null, []);
  }
}

export { Authentication };
