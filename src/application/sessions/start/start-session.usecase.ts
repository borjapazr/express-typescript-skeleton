import { DateTime } from 'luxon';

import { SessionResponse } from '@application/sessions';
import { BaseUseCase, UseCase } from '@application/shared';
import {
  Session,
  SessionExpiresAt,
  SessionRefreshTokenHash,
  SessionRepository,
  SessionUserData,
  SessionUserUuid,
  SessionUuid
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

  protected async performOperation({ userUuid }: StartSessionRequest): Promise<SessionResponse> {
    const {
      username: { value: username },
      email: { value: email },
      role: { value: role }
    } = await this.getAndValidateUser(userUuid);

    const sessionUuid = Uuid.random().value;

    const accessToken = this.tokenProviderDomainService.createAccessToken(
      sessionUuid,
      userUuid,
      username,
      email,
      Array.of(role)
    );

    const refreshToken = this.tokenProviderDomainService.createRefreshToken(sessionUuid, userUuid);

    const session = Session.create(
      new SessionUuid(sessionUuid),
      new SessionUserUuid(userUuid),
      await SessionRefreshTokenHash.createFromPlainRefreshToken(refreshToken.token),
      new SessionUserData(username, email, Array.of(role)),
      new SessionExpiresAt(DateTime.fromSeconds(refreshToken.expiration).toJSDate())
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
