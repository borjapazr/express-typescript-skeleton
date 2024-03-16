import { SessionResponse } from '@modules/sessions/application';
import {
  Session,
  SessionExpiresAt,
  SessionRefreshTokenHash,
  SessionRepository,
  SessionUserData
} from '@modules/sessions/domain';
import { TokenProviderDomainService } from '@modules/sessions/domain/tokens';
import { User, UserNotExistsException, UserRepository, UserUuid } from '@modules/users/domain';
import { BaseUseCase, UseCase } from '@shared/application';
import { Uuid } from '@shared/domain/value-object';

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
