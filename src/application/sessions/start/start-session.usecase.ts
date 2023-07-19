import { SessionResponse } from '@application/sessions';
import { BaseUseCase, UseCase } from '@application/shared';
import {
  Session,
  SessionExpiresAt,
  SessionRefreshTokenHash,
  SessionRepository,
  SessionUserData
} from '@domain/sessions';
import { TokenProviderDomainService } from '@domain/sessions/tokens';
import { Uuid } from '@domain/shared/value-object';
import { User, UserNotExistsException, UserRepository, UserUuid } from '@domain/users';

import { StartSessionRequest } from './start-session.request';

@UseCase()
class StartSessionUseCase extends BaseUseCase<StartSessionRequest, SessionResponse> {
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

  protected async performOperation({ userUuid: userUuidString }: StartSessionRequest): Promise<SessionResponse> {
    const { uuid: userUuid, username, email, roles } = await this.getAndValidateUser(userUuidString);

    const sessionUuid = Uuid.random();

    const accessToken = this.tokenProviderDomainService.createAccessToken(
      sessionUuid,
      userUuid,
      username,
      email,
      roles
    );

    const refreshToken = this.tokenProviderDomainService.createRefreshToken(
      sessionUuid,
      userUuid,
      username,
      email,
      roles
    );

    const session = Session.create(
      sessionUuid,
      userUuid,
      await SessionRefreshTokenHash.createFromPlainRefreshToken(refreshToken.value),
      new SessionUserData(
        username.value,
        email.value,
        roles.map(role => role.value)
      ),
      new SessionExpiresAt(refreshToken.expiresAt.value)
    );

    const createdSession = await this.sessionRepository.create(session);

    return SessionResponse.create(createdSession, accessToken, refreshToken);
  }

  private async getAndValidateUser(uuid: string): Promise<User> {
    const user = await this.userRepository.findByUuid(new UserUuid(uuid));

    if (user == null) {
      throw new UserNotExistsException(uuid);
    }

    return user;
  }
}

export { StartSessionUseCase };
