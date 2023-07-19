import { SessionUuid } from '@domain/sessions/session-uuid';
import { UserEmail, UserRole, UserUsername, UserUuid } from '@domain/users';

import { Token, TokenType } from './token';
import { TokenExpiresAt } from './token-expires-at';

class AccessToken extends Token {
  constructor(
    sessionUuid: SessionUuid,
    value: string,
    expiresAt: TokenExpiresAt,
    userUuid: UserUuid,
    username: UserUsername,
    email: UserEmail,
    roles: UserRole[]
  ) {
    super(TokenType.ACCESS_TOKEN, sessionUuid, value, expiresAt, userUuid, username, email, roles);
  }

  public static create(
    sessionUuid: SessionUuid,
    value: string,
    expiresAt: TokenExpiresAt,
    userUuid: UserUuid,
    username: UserUsername,
    email: UserEmail,
    roles: UserRole[]
  ): AccessToken {
    return new AccessToken(sessionUuid, value, expiresAt, userUuid, username, email, roles);
  }
}

export { AccessToken };
