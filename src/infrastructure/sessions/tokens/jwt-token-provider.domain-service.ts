import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

import { SessionUuid } from '@domain/sessions/session-uuid';
import { AccessToken, RefreshToken, TokenProviderDomainService } from '@domain/sessions/tokens';
import { TokenType } from '@domain/sessions/tokens/token';
import { TokenExpiresAt } from '@domain/sessions/tokens/token-expires-at';
import { Nullable } from '@domain/shared';
import { DomainService } from '@domain/shared/services';
import { UserEmail, UserRole, UserUsername, UserUuid } from '@domain/users';
import { GlobalConfig } from '@infrastructure/shared/config';

@DomainService({ type: TokenProviderDomainService })
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
    const expiresAt = this.getAccessTokenExpiration();
    const jwtToken = jwt.sign(
      {
        type: TokenType.ACCESS_TOKEN,
        sessionUuid: sessionUuid.value,
        userUuid: userUuid.value,
        username: username.value,
        email: email.value,
        roles: userRoles,
        exp: Math.floor(DateTime.fromJSDate(expiresAt.value).toSeconds())
      },
      this.jwtSecret,
      {
        algorithm: this.jwtAlgorithm
      }
    );
    return AccessToken.create(sessionUuid, jwtToken, expiresAt, userUuid, username, email, roles);
  }

  public createRefreshToken(
    sessionUuid: SessionUuid,
    userUuid: UserUuid,
    username: UserUsername,
    email: UserEmail,
    roles: UserRole[]
  ): RefreshToken {
    const userRoles = roles.map(role => role.value);
    const expiresAt = this.getRefreshTokenExpiration();
    const jwtToken = jwt.sign(
      {
        type: TokenType.REFRESH_TOKEN,
        sessionUuid: sessionUuid.value,
        userUuid: userUuid.value,
        username: username.value,
        email: email.value,
        roles: userRoles,
        exp: Math.floor(DateTime.fromJSDate(expiresAt.value).toSeconds())
      },
      this.jwtSecret,
      {
        algorithm: this.jwtAlgorithm
      }
    );

    return RefreshToken.create(sessionUuid, jwtToken, expiresAt, userUuid, username, email, roles);
  }

  public parseAccessToken(token: string): Nullable<AccessToken> {
    try {
      const { type, sessionUuid, userUuid, username, email, roles, exp } = <any>jwt.verify(token, this.jwtSecret, {
        algorithms: [this.jwtAlgorithm]
      });
      return type === TokenType.ACCESS_TOKEN
        ? AccessToken.create(
            new SessionUuid(sessionUuid),
            token,
            new TokenExpiresAt(DateTime.fromSeconds(exp).toJSDate()),
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
      const { type, sessionUuid, userUuid, username, email, roles, exp } = <any>jwt.verify(token, this.jwtSecret, {
        algorithms: [this.jwtAlgorithm]
      });
      return type === TokenType.REFRESH_TOKEN
        ? RefreshToken.create(
            new SessionUuid(sessionUuid),
            token,
            new TokenExpiresAt(DateTime.fromSeconds(exp).toJSDate()),
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

  private getAccessTokenExpiration(): TokenExpiresAt {
    return new TokenExpiresAt(
      DateTime.utc()
        .plus({ millisecond: this.jwtExpiration * 3_600_000 })
        .toJSDate()
    );
  }

  private getRefreshTokenExpiration(): TokenExpiresAt {
    return new TokenExpiresAt(
      DateTime.utc()
        .plus({ millisecond: this.jwtRefreshExpiration * 3_600_000 })
        .toJSDate()
    );
  }
}

export { JwtTokenProvider };
