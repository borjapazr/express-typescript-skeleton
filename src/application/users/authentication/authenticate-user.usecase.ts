import { BaseUseCase, UseCase } from '@application/shared';
import { UserResponse } from '@application/users';
import { Nullable } from '@domain/shared';
import { User, UserRepository, UserUsername } from '@domain/users';
import {
  InvalidAuthenticationCredentialsException,
  InvalidAuthenticationUsernameException
} from '@domain/users/authentication';

import { AuthenticateUserRequest } from './authenticate-user.request';

@UseCase()
class AuthenticateUserUseCase extends BaseUseCase<AuthenticateUserRequest, UserResponse> {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    super();
    this.userRepository = userRepository;
  }

  public async performOperation({ username, password }: AuthenticateUserRequest): Promise<UserResponse> {
    const user = await this.userRepository.findByUsername(new UserUsername(username));

    this.ensureUserExists(user, username);

    await this.ensureCredentialsAreValid(user as User, password);

    return UserResponse.fromDomainModel(user as User);
  }

  private ensureUserExists(user: Nullable<User>, username: string): void {
    if (!user) {
      throw new InvalidAuthenticationUsernameException(username);
    }
  }

  private async ensureCredentialsAreValid(user: User, password: string): Promise<void> {
    if (!(await user?.passwordMatches(password))) {
      throw new InvalidAuthenticationCredentialsException(user.username.value);
    }
  }
}

export { AuthenticateUserUseCase };
