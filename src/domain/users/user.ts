import { Nullable } from '@domain/shared';
import { DomainEntity } from '@domain/shared/entities/domain-entity';

import { UserAddress } from './user-address';
import { UserBirthDate } from './user-birth-date';
import { UserEmail } from './user-email';
import { UserGender } from './user-gender';
import { UserId } from './user-id';
import { UserName } from './user-name';
import { UserPasswordHash } from './user-password-hash';
import { UserPhoneNumber } from './user-phone-number';
import { UserProfilePicture } from './user-profile-picture';
import { UserRole } from './user-role';
import { UserUsername } from './user-username';
import { UserUuid } from './user-uuid';

class User extends DomainEntity {
  id: Nullable<UserId>;

  uuid: UserUuid;

  gender: UserGender;

  name: UserName;

  birthDate: UserBirthDate;

  username: UserUsername;

  email: UserEmail;

  phoneNumber: UserPhoneNumber;

  address: UserAddress;

  profilePicUrl: UserProfilePicture;

  passwordHash: UserPasswordHash;

  roles: UserRole[];

  verified: boolean;

  enabled: boolean;

  constructor(
    id: Nullable<UserId>,
    uuid: UserUuid,
    gender: UserGender,
    name: UserName,
    birthDate: UserBirthDate,
    username: UserUsername,
    email: UserEmail,
    phoneNumber: UserPhoneNumber,
    address: UserAddress,
    profilePicUrl: UserProfilePicture,
    passwordHash: UserPasswordHash,
    roles: UserRole[],
    verified: boolean,
    enabled: boolean
  ) {
    super();
    this.id = id;
    this.uuid = uuid;
    this.gender = gender;
    this.name = name;
    this.birthDate = birthDate;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.profilePicUrl = profilePicUrl;
    this.passwordHash = passwordHash;
    this.roles = roles;
    this.verified = verified;
    this.enabled = enabled;
  }

  public static create(
    uuid: UserUuid,
    gender: UserGender,
    name: UserName,
    birthDate: UserBirthDate,
    username: UserUsername,
    email: UserEmail,
    phoneNumber: UserPhoneNumber,
    address: UserAddress,
    profilePicUrl: UserProfilePicture,
    passwordHash: UserPasswordHash,
    roles: UserRole[],
    verified: boolean,
    enabled: boolean
  ): User {
    return new User(
      undefined,
      uuid,
      gender,
      name,
      birthDate,
      username,
      email,
      phoneNumber,
      address,
      profilePicUrl,
      passwordHash,
      roles,
      verified,
      enabled
    );
  }

  public async passwordMatches(plainUserPassword: string): Promise<boolean> {
    return this.passwordHash.checkIfMatchesWithPlainPassword(plainUserPassword);
  }
}

export { User };
