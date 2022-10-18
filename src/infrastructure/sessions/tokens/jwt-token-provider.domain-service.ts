import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

import { SessionUuid } from '@domain/sessions/session-uuid';
import { AccessToken, RefreshToken, TokenProviderDomainService } from '@domain/sessions/tokens';
import { TokenType } from '@domain/sessions/tokens/token';
import { DomainService, Nullable } from '@domain/shared';
import { UserEmail, UserRole, UserUsername, UserUuid } from '@domain/users';
import { GlobalConfig } from '@infrastructure/shared/config';

@DomainService(TokenProviderDomainService)
class JwtTokenProvider extends TokenProviderDomainService {
  private readonly jwtAlgorithm: any = 'HS512';

  private readonly jwtSecret: string = GlobalConfig.JWT_SECRET;

  private readonly jwtExpiration: number = GlobalConfig.JWT_EXPIRATION;

  private readonly jwtRefreshExpiration: number = GlobalConfig.JWT_REFRESH_EXPIRATION;

  public createAccessToken(
    sessionUuid: SessionUuid,
    userUuid: UserUuid,
    username: UserUsername,
    email: UserEmail,
    roles: UserRole[]
  ): AccessToken {
    const userRoles = roles.map(role => role.value);
    const expiration = this.getAccessTokenExpiration();
    const jwtToken = jwt.sign(
      {
        type: TokenType.ACCESS_TOKEN,
        sessionUuid: sessionUuid.value,
        userUuid: userUuid.value,
        username: username.value,
        email: email.value,
        roles: userRoles,
        exp: expiration
      },
      this.jwtSecret,
      {
        algorithm: this.jwtAlgorithm
      }
    );
    return new AccessToken(sessionUuid, jwtToken, expiration, userUuid, username, email, roles);
  }

  public createRefreshToken(sessionUuid: SessionUuid, userUuid: UserUuid): RefreshToken {
    const expiration = this.getRefreshTokenExpiration();
    const jwtToken = jwt.sign(
      { type: TokenType.REFRESH_TOKEN, sessionUuid: sessionUuid.value, userUuid: userUuid.value, exp: expiration },
      this.jwtSecret,
      {
        algorithm: this.jwtAlgorithm
      }
    );

    return new RefreshToken(sessionUuid, jwtToken, expiration, userUuid);
  }

  public parseAccessToken(token: string): Nullable<AccessToken> {
    try {
      const { type, sessionUuid, userUuid, username, email, roles, exp } = <any>jwt.verify(token, this.jwtSecret, {
        algorithms: [this.jwtAlgorithm]
      });
      return type === TokenType.ACCESS_TOKEN
        ? new AccessToken(
            new SessionUuid(sessionUuid),
            token,
            exp,
            new UserUuid(userUuid),
            new UserUsername(username),
            new UserEmail(email),
            roles.map(UserRole.fromValue)
          )
        : null;
    } catch {
      return null;
    }
  }

  public parseRefreshToken(token: string): Nullable<RefreshToken> {
    try {
      const { type, sessionUuid, userUuid, exp } = <any>jwt.verify(token, this.jwtSecret, {
        algorithms: [this.jwtAlgorithm]
      });
      return type === TokenType.REFRESH_TOKEN
        ? new RefreshToken(new SessionUuid(sessionUuid), token, exp, new UserUuid(userUuid))
        : null;
    } catch {
      return null;
    }
  }

  private getAccessTokenExpiration(): number {
    return Math.floor(
      DateTime.utc()
        .plus({ millisecond: this.jwtExpiration * 3_600_000 })
        .toSeconds()
    );
  }

  private getRefreshTokenExpiration(): number {
    return Math.floor(
      DateTime.utc()
        .plus({ millisecond: this.jwtRefreshExpiration * 3_600_000 })
        .toSeconds()
    );
  }
}

export { JwtTokenProvider };
