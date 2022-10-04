import { Default, Email, Enum, Format, Integer, Property } from '@tsed/schema';

import { UserResponse } from '@application/users';
import { Nullable } from '@domain/shared';
import { UserGenders, UserRoles } from '@domain/users';

class UserApiResponse {
  @Integer()
  readonly id: Nullable<number>;

  @Property()
  readonly uuid: string;

  @Enum(UserGenders)
  @Default(UserGenders.UNDEFINED)
  readonly gender: string;

  @Property()
  readonly firstName: string;

  @Property()
  readonly lastName: string;

  @Format('date')
  readonly birthDate: Date;

  @Property()
  readonly username: string;

  @Email()
  readonly email: string;

  @Property()
  readonly phoneNumber: string;

  @Property()
  readonly address: string;

  @Property()
  readonly profilePicUrl: string;

  @Property()
  readonly passwordHash: string;

  @Enum(UserRoles)
  @Default(UserRoles.USER)
  readonly role: string;

  @Property()
  readonly verified: boolean;

  @Property()
  readonly enabled: boolean;

  constructor(
    id: Nullable<number>,
    uuid: string,
    gender: string,
    firstName: string,
    lastName: string,
    birthDate: Date,
    username: string,
    email: string,
    phoneNumber: string,
    address: string,
    profilePicUrl: string,
    passwordHash: string,
    role: string,
    verified: boolean,
    enabled: boolean
  ) {
    this.id = id;
    this.uuid = uuid;
    this.gender = gender;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.profilePicUrl = profilePicUrl;
    this.passwordHash = passwordHash;
    this.role = role;
    this.verified = verified;
    this.enabled = enabled;
  }

  public static fromUserApiResponse(user: UserResponse): UserApiResponse {
    return new UserApiResponse(
      user.id,
      user.uuid,
      user.gender,
      user.firstName,
      user.lastName,
      user.birthDate,
      user.username,
      user.email,
      user.phoneNumber,
      user.address,
      user.profilePicUrl,
      user.passwordHash,
      user.role,
      user.verified,
      user.enabled
    );
  }
}

export { UserApiResponse };
