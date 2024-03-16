import { UserResponse } from '@modules/users/application';
import { User, UserRepository, UserUsername } from '@modules/users/domain';
import {
  InvalidAuthenticationCredentialsException,
  InvalidAuthenticationUsernameException
} from '@modules/users/domain/authentication';
import { BaseUseCase, UseCase } from '@shared/application';
import { Nullable } from '@shared/domain';

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
