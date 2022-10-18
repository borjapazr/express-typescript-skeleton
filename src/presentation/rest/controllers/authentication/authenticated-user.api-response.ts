import { Default, Email, Enum, Format, Property } from '@tsed/schema';

import { UserResponse } from '@application/users';
import { UserGenders, UserRoles } from '@domain/users';

class AuthenticatedUserApiResponse {
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

  @Enum(UserRoles)
  @Default(UserRoles.USER)
  readonly roles: string[];

  constructor(
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
    roles: string[]
  ) {
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
    this.roles = roles;
  }

  public static fromUserResponse(user: UserResponse): AuthenticatedUserApiResponse {
    return new AuthenticatedUserApiResponse(
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
      user.roles
    );
  }
}

export { AuthenticatedUserApiResponse };
