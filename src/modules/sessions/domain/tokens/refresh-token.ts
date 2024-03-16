import { SessionUuid } from '@modules/sessions/domain/session-uuid';
import { UserEmail, UserRole, UserUsername, UserUuid } from '@modules/users/domain';

import { Token, TokenType } from './token';
import { TokenExpiresAt } from './token-expires-at';

class RefreshToken extends Token {
  constructor(
    sessionUuid: SessionUuid,
    value: string,
    expiresAt: TokenExpiresAt,
    userUuid: UserUuid,
    username: UserUsername,
    email: UserEmail,
    roles: UserRole[]
  ) {
    super(TokenType.REFRESH_TOKEN, sessionUuid, value, expiresAt, userUuid, username, email, roles);
  }

  public static create(
    sessionUuid: SessionUuid,
    value: string,
    expiresAt: TokenExpiresAt,
    userUuid: UserUuid,
    username: UserUsername,
    email: UserEmail,
    roles: UserRole[]
  ): RefreshToken {
    return new RefreshToken(sessionUuid, value, expiresAt, userUuid, username, email, roles);
  }
}

export { RefreshToken };
