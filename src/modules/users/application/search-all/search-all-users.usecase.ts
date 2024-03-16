import { UserResponse } from '@modules/users/application';
import { UserRepository } from '@modules/users/domain';
import { BaseUseCase, UseCase } from '@shared/application';

import { SearchAllUsersRequest } from './search-all-users.request';

@UseCase()
class SearchAllUsersUseCase extends BaseUseCase<SearchAllUsersRequest, UserResponse[]> {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    super();
    this.userRepository = userRepository;
  }

  public async performOperation(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();
    return users.map(UserResponse.fromDomainModel);
  }
}

export { SearchAllUsersUseCase };
