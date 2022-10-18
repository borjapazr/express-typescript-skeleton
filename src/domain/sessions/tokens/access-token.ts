import { SessionUuid } from '@domain/sessions/session-uuid';
import { UserEmail, UserRole, UserUsername, UserUuid } from '@domain/users';

import { Token, TokenType } from './token';

class AccessToken extends Token {
  readonly username: UserUsername;

  readonly email: UserEmail;

  readonly roles: UserRole[];

  constructor(
    sessionUuid: SessionUuid,
    token: string,
    expiration: number,
    userUuid: UserUuid,
    username: UserUsername,
    email: UserEmail,
    roles: UserRole[]
  ) {
    super(TokenType.ACCESS_TOKEN, sessionUuid, token, expiration, userUuid);
    this.username = username;
    this.email = email;
    this.roles = roles;
  }
}

export { AccessToken };
