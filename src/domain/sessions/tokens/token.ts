import { DateTime } from 'luxon';

import { SessionUuid } from '@domain/sessions/session-uuid';
import { UserUuid } from '@domain/users';

enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token'
}

class Token {
  readonly type: TokenType;

  readonly sessionUuid: SessionUuid;

  readonly token: string;

  readonly expiration: number;

  readonly userUuid: UserUuid;

  constructor(type: TokenType, sessionUuid: SessionUuid, token: string, expiration: number, userUuid: UserUuid) {
    this.type = type;
    this.sessionUuid = sessionUuid;
    this.token = token;
    this.expiration = expiration;
    this.userUuid = userUuid;
  }

  public isExpired(): boolean {
    const currentTimestamp = DateTime.utc().toSeconds();
    return currentTimestamp > this.expiration;
  }

  public toString(): string {
    return JSON.stringify(this);
  }
}

export { Token, TokenType };
