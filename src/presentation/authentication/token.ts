import { DateTime } from 'luxon';

enum TokenType {
  ACCESS = 'access_token',
  REFRESH = 'refresh_token'
}

class Token {
  constructor(
    public readonly type: string,
    public readonly token: string,
    public readonly expiration: number,
    public readonly userId: number | string,
    public readonly username: string,
    public readonly email: string,
    public readonly roles?: string[]
  ) {}

  public isExpired(): boolean {
    const currentTimestamp = DateTime.utc().toSeconds();
    return currentTimestamp > this.expiration;
  }

  public toString(): string {
    return JSON.stringify(this);
  }
}

export { Token, TokenType };
