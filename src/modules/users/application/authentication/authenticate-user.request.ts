import { UseCaseRequest } from '@shared/application';
import { TriggeredBy } from '@shared/domain/entities/triggered-by';
import { InvalidParameterException } from '@shared/domain/exceptions';

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
      throw new InvalidParameterException('Username must be provided');
    }

    if (this.password == null) {
      throw new InvalidParameterException('Password must be provided');
    }
  }
}

export { AuthenticateUserRequest };
