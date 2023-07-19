import { UserModel, UsersRepository } from '@tsed/prisma';

import { Nullable } from '@domain/shared';
import { UserEmail, UserRepository, UserUuid } from '@domain/users';
import { User } from '@domain/users/user';
import { UserUsername } from '@domain/users/user-username';
import { BaseRepository, RepositoryAction } from '@infrastructure/shared/persistence/base-repository';
import { Repository } from '@infrastructure/shared/persistence/repository.decorator';

import { PrismaUserMapper } from './prisma-user.mapper';

@Repository({ enabled: true, type: UserRepository })
class PrismaUserRepository extends BaseRepository<UserModel> implements UserRepository {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    super();
    this.usersRepository = usersRepository;
  }

  public async findByUuid(uuid: UserUuid): Promise<Nullable<User>> {
    const user = await this.usersRepository.findFirst({
      where: { uuid: uuid.value, deletedAt: null }
    });

    return user ? PrismaUserMapper.toDomainModel(user) : null;
  }

  public async findByUsername(username: UserUsername): Promise<Nullable<User>> {
    const user = await this.usersRepository.findFirst({
      where: { username: username.value, deletedAt: null }
    });

    return user ? PrismaUserMapper.toDomainModel(user) : null;
  }

  public async findByEmail(email: UserEmail): Promise<Nullable<User>> {
    const user = await this.usersRepository.findFirst({
      where: { email: email.value, deletedAt: null }
    });

    return user ? PrismaUserMapper.toDomainModel(user) : null;
  }

  public async findAll(): Promise<User[]> {
    const users = await this.usersRepository.findMany({
      where: { deletedAt: null }
    });

    return users.map(PrismaUserMapper.toDomainModel);
  }

  public async create(user: User): Promise<User> {
    const createdUser = await this.usersRepository.create({
      data: this.getAuditablePersitenceModel(RepositoryAction.CREATE, PrismaUserMapper.toPersistenceModel(user))
    });
    return PrismaUserMapper.toDomainModel(createdUser);
  }

  public async update(user: User): Promise<User> {
    const updatedUser = await this.usersRepository.update({
      where: { uuid: user.uuid.value },
      data: this.getAuditablePersitenceModel(RepositoryAction.UPDATE, PrismaUserMapper.toPersistenceModel(user))
    });
    return PrismaUserMapper.toDomainModel(updatedUser);
  }

  public async delete(uuid: UserUuid): Promise<void> {
    await this.usersRepository.update({
      where: { uuid: uuid.value },
      data: this.getAuditablePersitenceModel(RepositoryAction.DELETE)
    });
  }
}

export { PrismaUserRepository };
