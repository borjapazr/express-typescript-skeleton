import { Session } from '@domain/sessions/session';
import { AccessToken, RefreshToken } from '@domain/sessions/tokens';
import { Nullable } from '@domain/shared';

class ValidatedSessionResponse {
  public session: Nullable<Session>;

  public accessToken: Nullable<AccessToken>;

  public refreshToken: Nullable<RefreshToken>;

  public wasRefreshed: boolean;

  constructor(
    session: Nullable<Session>,
    accessToken: Nullable<AccessToken>,
    refreshToken: Nullable<RefreshToken>,
    wasRefreshed: boolean
  ) {
    this.session = session;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.wasRefreshed = wasRefreshed;
  }

  public static createValidatedSession(
    session: Session,
    accessToken: AccessToken,
    refreshToken: Nullable<RefreshToken>
  ): ValidatedSessionResponse {
    return new ValidatedSessionResponse(session, accessToken, refreshToken, false);
  }

  public static createRefreshedSession(
    session: Session,
    accessToken: AccessToken,
    refreshToken: RefreshToken
  ): ValidatedSessionResponse {
    return new ValidatedSessionResponse(session, accessToken, refreshToken, true);
  }
}

export { ValidatedSessionResponse };
