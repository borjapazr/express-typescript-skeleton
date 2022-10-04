import { InvalidParameterException } from '@domain/shared/exceptions';
import { EnumValueObject } from '@domain/shared/value-object/enum-value-object';

enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  AUDITOR = 'auditor'
}

class UserRole extends EnumValueObject<UserRoles> {
  constructor(value: UserRoles) {
    super(value, Object.values(UserRoles));
  }

  public static fromValue(value: string): UserRole {
    switch (value) {
      case UserRoles.ADMIN: {
        return new UserRole(UserRoles.ADMIN);
      }
      case UserRoles.USER: {
        return new UserRole(UserRoles.USER);
      }
      case UserRoles.AUDITOR: {
        return new UserRole(UserRoles.AUDITOR);
      }
      default: {
        throw new InvalidParameterException(`The role ${value} is invalid`);
      }
    }
  }

  protected throwErrorForInvalidValue(value: UserRoles): void {
    throw new InvalidParameterException(`The role ${value} is invalid`);
  }
}

export { UserRole, UserRoles };
