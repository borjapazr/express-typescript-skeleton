import { UseCaseRequest } from '@application/shared';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';
import { InvalidParameterException } from '@domain/shared/exceptions';

class AuthenticateUserRequest extends UseCaseRequest {
  readonly username: string;

  readonly password: string;

  constructor(triggeredBy: TriggeredBy, username: string, password: string) {
    super(triggeredBy);
    this.username = username;
    this.password = password;
  }

  public static create(triggeredBy: TriggeredBy, username: string, password: string): AuthenticateUserRequest {
    return new AuthenticateUserRequest(triggeredBy, username, password);
  }

  protected validatePayload(): void {
    if (this.username == null) {
      throw new InvalidParameterException('<username> can not be null');
    }

    if (this.password == null) {
      throw new InvalidParameterException('<password> can not be null');
    }
  }
}

export { AuthenticateUserRequest };
