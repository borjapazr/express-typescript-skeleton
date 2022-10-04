import { Nullable } from '@domain/shared';
import { User } from '@domain/users';

class UserResponse {
  readonly id: Nullable<number>;

  readonly uuid: string;

  readonly gender: string;

  readonly firstName: string;

  readonly lastName: string;

  readonly birthDate: Date;

  readonly username: string;

  readonly email: string;

  readonly phoneNumber: string;

  readonly address: string;

  readonly profilePicUrl: string;

  readonly passwordHash: string;

  readonly role: string;

  readonly verified: boolean;

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

  public static fromDomainModel(user: User): UserResponse {
    return new UserResponse(
      user.id?.value,
      user.uuid.value,
      user.gender.value,
      user.name.firstName,
      user.name.lastName,
      user.birthDate.value,
      user.username.value,
      user.email.value,
      user.phoneNumber.value,
      user.address.value,
      user.profilePicUrl.value,
      user.passwordHash.value,
      user.role.value,
      user.verified,
      user.enabled
    );
  }
}

export { UserResponse };
