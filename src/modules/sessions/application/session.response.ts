import { Session } from '@modules/sessions/domain/session';
import { AccessToken, RefreshToken } from '@modules/sessions/domain/tokens';

class SessionResponse {
  readonly session: Session;

  readonly accessToken: AccessToken;

  readonly refreshToken: RefreshToken;

  constructor(session: Session, accessToken: AccessToken, refreshToken: RefreshToken) {
    this.session = session;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public static create(session: Session, accessToken: AccessToken, refreshToken: RefreshToken): SessionResponse {
    return new SessionResponse(session, accessToken, refreshToken);
  }
}

export { SessionResponse };
