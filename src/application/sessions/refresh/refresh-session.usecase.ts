import { SessionResponse } from '@application/sessions';
import { BaseUseCase, UseCase } from '@application/shared';
import {
  InvalidSessionException,
  Session,
  SessionExpiresAt,
  SessionRefreshTokenHash,
  SessionRepository,
  SessionUserData
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
      session.uuid,
      user.uuid,
      user.username,
      user.email,
      user.roles
    );

    const newRefreshToken = this.tokenProviderDomainService.createRefreshToken(
      session.uuid,
      user.uuid,
      user.username,
      user.email,
      user.roles
    );

    session.refreshTokenHash = await SessionRefreshTokenHash.createFromPlainRefreshToken(newRefreshToken.value);
    session.expiresAt = new SessionExpiresAt(refreshToken.expiresAt.value);
    session.userData = new SessionUserData(
      user.username.value,
      user.email.value,
      user.roles.map(role => role.value)
    );

    this.sessionRepository.update(session);

    return SessionResponse.create(session, newAccessToken, newRefreshToken);
  }

  private getAndValidateRefreshToken(refreshTokenString: string): RefreshToken {
    const refreshToken = this.tokenProviderDomainService.parseRefreshToken(refreshTokenString);

    if (refreshToken == null) {
      throw new InvalidSessionException();
    }

    return refreshToken;
  }

  private async getAndValidateSession(refreshToken: RefreshToken): Promise<Session> {
    const session = await this.sessionRepository.findByUuid(refreshToken.sessionUuid);

    if (session == null || !(await session.refreshTokenMatches(refreshToken.value)) || !session.isActive()) {
      throw new InvalidSessionException();
    }

    return session;
  }

  private async getAndValidateUser(uuid: UserUuid): Promise<User> {
    const user = await this.userRepository.findByUuid(uuid);

    if (user == null) {
      throw new InvalidSessionException();
    }

    return user;
  }
}

export { RefreshSessionUseCase };
