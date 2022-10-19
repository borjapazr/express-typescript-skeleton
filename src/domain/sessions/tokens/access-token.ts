import { SessionUuid } from '@domain/sessions/session-uuid';
import { UserEmail, UserRole, UserUsername, UserUuid } from '@domain/users';

import { Token, TokenFlattened, TokenType } from './token';
import { TokenExpiresAt } from './token-expires-at';

interface AccessTokenFlattened extends TokenFlattened {
  username: string;
  email: string;
  roles: string[];
}

class AccessToken extends Token {
  readonly username: UserUsername;

  readonly email: UserEmail;

  readonly roles: UserRole[];

  constructor(
    sessionUuid: SessionUuid,
    value: string,
    expiresAt: TokenExpiresAt,
    userUuid: UserUuid,
    username: UserUsername,
    email: UserEmail,
    roles: UserRole[]
  ) {
    super(TokenType.ACCESS_TOKEN, sessionUuid, value, expiresAt, userUuid);
    this.username = username;
    this.email = email;
    this.roles = roles;
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

  public flat(): AccessTokenFlattened {
    return {
      ...super.flat(),
      username: this.username.value,
      email: this.email.value,
      roles: this.roles.map(role => role.value)
    };
  }
}

export { AccessToken, AccessTokenFlattened };
