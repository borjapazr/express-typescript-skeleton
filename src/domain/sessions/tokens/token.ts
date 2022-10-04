import { DateTime } from 'luxon';

enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token'
}

class Token {
  readonly type: string;

  readonly uuid: string;

  readonly token: string;

  readonly expiration: number;

  readonly userUuid: string;

  constructor(type: string, uuid: string, token: string, expiration: number, userUuid: string) {
    this.type = type;
    this.uuid = uuid;
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
