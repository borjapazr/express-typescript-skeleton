import { SessionUuid } from '@domain/sessions/session-uuid';
import { UserUuid } from '@domain/users';

import { Token, TokenType } from './token';

class RefreshToken extends Token {
  constructor(sessionUuid: SessionUuid, token: string, expiration: number, userUuid: UserUuid) {
    super(TokenType.REFRESH_TOKEN, sessionUuid, token, expiration, userUuid);
  }
}

export { RefreshToken };
