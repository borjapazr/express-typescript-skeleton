import { Token, TokenType } from './token';

class RefreshToken extends Token {
  constructor(uuid: string, token: string, expiration: number, userUuid: string) {
    super(TokenType.REFRESH_TOKEN, uuid, token, expiration, userUuid);
  }
}

export { RefreshToken };
