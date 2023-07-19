import { DateTime } from 'luxon';

import { SessionUuid } from '@domain/sessions/session-uuid';
import { UserEmail, UserRole, UserUsername, UserUuid } from '@domain/users';

import { TokenExpiresAt } from './token-expires-at';

enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token'
}

interface TokenFlattened {
  type: TokenType;
  sessionUuid: string;
  value: string;
  expiresAt: Date;
  userUuid: string;
  username: string;
  email: string;
  roles: string[];
}

abstract class Token {
  readonly type: TokenType;

  readonly sessionUuid: SessionUuid;

  readonly value: string;

  readonly expiresAt: TokenExpiresAt;

  readonly userUuid: UserUuid;

  readonly username: UserUsername;

  readonly email: UserEmail;

  readonly roles: UserRole[];

  constructor(
    type: TokenType,
    sessionUuid: SessionUuid,
    value: string,
    expiresAt: TokenExpiresAt,
    userUuid: UserUuid,
    username: UserUsername,
    email: UserEmail,
    roles: UserRole[]
  ) {
    this.type = type;
    this.sessionUuid = sessionUuid;
    this.value = value;
    this.expiresAt = expiresAt;
    this.userUuid = userUuid;
    this.username = username;
    this.email = email;
    this.roles = roles;
  }

  public isExpired(): boolean {
    return this.expiresAt.value < DateTime.utc().toJSDate();
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  public flat(): TokenFlattened {
    return {
      type: this.type,
      sessionUuid: this.sessionUuid.value,
      value: this.value,
      expiresAt: this.expiresAt.value,
      userUuid: this.userUuid.value,
      username: this.username.value,
      email: this.email.value,
      roles: this.roles.map(role => role.value)
    };
  }
}

export { Token, TokenFlattened, TokenType };
