import { Token, TokenType } from './token';

class AccessToken extends Token {
  readonly username: string;

  readonly email: string;

  readonly roles: string[];

  constructor(
    uuid: string,
    token: string,
    expiration: number,
    userUuid: string,
    username: string,
    email: string,
    roles: string[]
  ) {
    super(TokenType.ACCESS_TOKEN, uuid, token, expiration, userUuid);
    this.username = username;
    this.email = email;
    this.roles = roles;
  }
}

export { AccessToken };
