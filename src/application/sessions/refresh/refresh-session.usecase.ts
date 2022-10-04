import { DateTime } from 'luxon';

import { SessionResponse } from '@application/sessions';
import { BaseUseCase, UseCase } from '@application/shared';
import {
  InvalidSessionException,
  Session,
  SessionExpiresAt,
  SessionRefreshTokenHash,
  SessionRepository,
  SessionUserData,
  SessionUuid
} from '@domain/sessions';
import { RefreshToken, TokenProviderDomainService } from '@domain/sessions/tokens';
import { User, UserRepository, UserUuid } from '@domain/users';

import { RefreshSessionRequest } from './refresh-session.request';

@UseCase()
class RefreshSessionUseCase extends BaseUseCase<RefreshSessionRequest, SessionResponse> {
  private tokenProviderDomainService: TokenProviderDomainService;

  private userRepository: UserRepository;

  private sessionRepository: SessionRepository;

  constructor(
    tokenProviderDomainService: TokenProviderDomainService,
    userRepository: UserRepository,
    sessionRepository: SessionRepository
  ) {
    super();
    this.tokenProviderDomainService = tokenProviderDomainService;
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
  }

  protected async performOperation({
    refreshToken: refreshTokenString
  }: RefreshSessionRequest): Promise<SessionResponse> {
    const refreshToken = this.getAndValidateRefreshToken(refreshTokenString);

    const session = await this.getAndValidateSession(refreshToken);

    const user = await this.getAndValidateUser(refreshToken.userUuid);

    const newAccessToken = this.tokenProviderDomainService.createAccessToken(
      session.uuid.value,
      user.uuid.value,
      user.username.value,
      user.email.value,
      Array.of(user.role.value)
    );

    const newRefreshToken = this.tokenProviderDomainService.createRefreshToken(session.uuid.value, user.uuid.value);

    session.refreshTokenHash = await SessionRefreshTokenHash.createFromPlainRefreshToken(newRefreshToken.token);
    session.expiresAt = new SessionExpiresAt(DateTime.fromSeconds(refreshToken.expiration).toJSDate());
    session.userData = new SessionUserData(user.username.value, user.email.value, [user.role.value]);

    this.sessionRepository.update(session);

    return SessionResponse.create(session, newAccessToken, newRefreshToken);
  }

  private getAndValidateRefreshToken(refreshTokenString: string): RefreshToken {
    const refreshToken = this.tokenProviderDomainService.parseRefreshToken(refreshTokenString);

    if (refreshToken == null) {
      throw new Error('Invalid refresh token');
    }

    return refreshToken;
  }

  private async getAndValidateSession(refreshToken: RefreshToken): Promise<Session> {
    const session = await this.sessionRepository.findByUuid(new SessionUuid(refreshToken.uuid));

    if (session == null || !(await session.refreshTokenMatches(refreshToken.token)) || session.isExpired()) {
      throw new InvalidSessionException();
    }

    return session;
  }

  private async getAndValidateUser(uuid: string): Promise<User> {
    const user = await this.userRepository.findByUuid(new UserUuid(uuid));

    if (user == null) {
      throw new InvalidSessionException();
    }

    return user;
  }
}

export { RefreshSessionUseCase };
