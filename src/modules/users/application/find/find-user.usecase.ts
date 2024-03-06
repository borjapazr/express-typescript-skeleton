import { UserResponse } from '@modules/users/application';
import { User, UserNotExistsException, UserRepository, UserUuid } from '@modules/users/domain';
import { BaseUseCase, UseCase } from '@shared/application';
import { Nullable } from '@shared/domain';

import { FindUserRequest } from './find-user.request';

@UseCase()
class FindUserUseCase extends BaseUseCase<FindUserRequest, UserResponse> {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    super();
    this.userRepository = userRepository;
  }

  public async performOperation({ uuid }: FindUserRequest): Promise<UserResponse> {
    const user = await this.userRepository.findByUuid(new UserUuid(uuid));

    this.ensureUserExists(user, uuid);

    return UserResponse.fromDomainModel(user as User);
  }

  private ensureUserExists(user: Nullable<User>, uuid: string): void {
    if (!user) {
      throw new UserNotExistsException(uuid);
    }
  }
}

export { FindUserUseCase };
