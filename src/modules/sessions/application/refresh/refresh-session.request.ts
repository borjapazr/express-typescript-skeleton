import { UseCaseRequest } from '@shared/application';
import { TriggeredBy } from '@shared/domain/entities/triggered-by';
import { InvalidParameterException } from '@shared/domain/exceptions';

class RefreshSessionRequest extends UseCaseRequest {
  readonly refreshToken: string;

  constructor(triggeredBy: TriggeredBy, refreshToken: string) {
    super(triggeredBy);
    this.refreshToken = refreshToken;
  }

  public static create(triggeredBy: TriggeredBy, refreshToken: string): RefreshSessionRequest {
    return new RefreshSessionRequest(triggeredBy, refreshToken);
  }

  protected validatePayload(): void {
    if (this.refreshToken == null) {
      throw new InvalidParameterException('Refresh Token must be provided');
    }
  }
}

export { RefreshSessionRequest };
