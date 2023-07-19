import { BaseUseCase, UseCase } from '@application/shared';
import {
  InvalidSessionException,
  SessionExpiresAt,
  SessionRefreshTokenHash,
  SessionRepository,
  SessionUserData
} from '@domain/sessions';
import { TokenProviderDomainService } from '@domain/sessions/tokens';
import { UserRepository } from '@domain/users';

import { ValidateSessionRequest } from './validate-session.request';
import { ValidatedSessionResponse } from './validated-session.response';

@UseCase()
class ValidateSessionUseCase extends BaseUseCase<ValidateSessionRequest, ValidatedSessionResponse> {
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
    accessToken: accessTokenString,
    refreshToken: refreshTokenString
  }: ValidateSessionRequest): Promise<ValidatedSessionResponse> {
    const accessToken = accessTokenString ? this.tokenProviderDomainService.parseAccessToken(accessTokenString) : null;

    const refreshToken = refreshTokenString
      ? this.tokenProviderDomainService.parseRefreshToken(refreshTokenString)
      : null;

    if (accessToken != null && !accessToken.isExpired()) {
      const session = await this.sessionRepository.findByUuid(accessToken.sessionUuid);

      if (session != null && session.isActive()) {
        return ValidatedSessionResponse.createValidatedSession(session, accessToken, refreshToken);
      }
    }

    if (refreshToken != null && !refreshToken.isExpired()) {
      const session = await this.sessionRepository.findByUuid(refreshToken.sessionUuid);

      const user = await this.userRepository.findByUuid(refreshToken.userUuid);

      if (session != null && session.isActive() && user != null) {
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

        return ValidatedSessionResponse.createRefreshedSession(session, newAccessToken, newRefreshToken);
      }
    }

    throw new InvalidSessionException();
  }
}

export { ValidateSessionUseCase };
