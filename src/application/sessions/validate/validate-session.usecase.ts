import { DateTime } from 'luxon';

import { BaseUseCase, UseCase } from '@application/shared';
import {
  InvalidSessionException,
  SessionExpiresAt,
  SessionRefreshTokenHash,
  SessionRepository,
  SessionUserData,
  SessionUuid
} from '@domain/sessions';
import { TokenProviderDomainService } from '@domain/sessions/tokens';
import { UserRepository, UserUuid } from '@domain/users';

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

    if (accessToken != null && !accessToken.isExpired()) {
      const session = await this.sessionRepository.findByUuid(new SessionUuid(accessToken.uuid));

      if (session != null) {
        return ValidatedSessionResponse.createValidatedSession(session, accessToken, accessToken);
      }
    }

    const refreshToken = refreshTokenString
      ? this.tokenProviderDomainService.parseRefreshToken(refreshTokenString)
      : null;

    if (refreshToken != null && !refreshToken.isExpired()) {
      const session = await this.sessionRepository.findByUuid(new SessionUuid(refreshToken.uuid));
      const user = await this.userRepository.findByUuid(new UserUuid(refreshToken.userUuid));

      if (session != null && user != null) {
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

        return ValidatedSessionResponse.createRefreshedSession(session, newAccessToken, newRefreshToken);
      }
    }

    throw new InvalidSessionException();
  }
}

export { ValidateSessionUseCase };
