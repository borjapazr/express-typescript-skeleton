import { BaseUseCase, UseCase } from '@application/shared';
import {
  InvalidSessionException,
  Session,
  SessionRepository,
  SessionRevocationReason,
  SessionRevokedBy
} from '@domain/sessions';
import { TokenProviderDomainService } from '@domain/sessions/tokens';
import { Nullable } from '@domain/shared';

import { EndSessionRequest } from './end-session.request';

@UseCase()
class EndSessionUseCase extends BaseUseCase<EndSessionRequest, void> {
  private tokenProviderDomainService: TokenProviderDomainService;

  private sessionRepository: SessionRepository;

  constructor(tokenProviderDomainService: TokenProviderDomainService, sessionRepository: SessionRepository) {
    super();
    this.tokenProviderDomainService = tokenProviderDomainService;
    this.sessionRepository = sessionRepository;
  }

  protected async performOperation({
    accessToken: accessTokenString,
    refreshToken: refreshTokenString
  }: EndSessionRequest): Promise<void> {
    const session = await this.getAndValidateSession(accessTokenString, refreshTokenString);

    session.revoke(new SessionRevokedBy(session.userData.username), new SessionRevocationReason('logout'));

    await this.sessionRepository.update(session);
  }

  private async getAndValidateSession(
    accessTokenString: Nullable<string>,
    refreshTokenString: Nullable<string>
  ): Promise<Session> {
    let sessionUuid = null;

    if (accessTokenString) {
      sessionUuid = this.tokenProviderDomainService.parseAccessToken(accessTokenString)?.sessionUuid;
    }

    if (refreshTokenString) {
      sessionUuid = this.tokenProviderDomainService.parseRefreshToken(refreshTokenString)?.sessionUuid;
    }

    if (sessionUuid != null) {
      const session = await this.sessionRepository.findByUuid(sessionUuid);

      if (session != null) {
        return session;
      }
    }

    throw new InvalidSessionException();
  }
}

export { EndSessionUseCase };
