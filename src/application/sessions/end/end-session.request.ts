import { UseCaseRequest } from '@application/shared';
import { Nullable } from '@domain/shared';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';

class EndSessionRequest extends UseCaseRequest {
  readonly accessToken: Nullable<string>;

  readonly refreshToken: Nullable<string>;

  constructor(triggeredBy: TriggeredBy, accessToken: Nullable<string>, refreshToken: Nullable<string>) {
    super(triggeredBy);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public static create(
    triggeredBy: TriggeredBy,
    accessToken: Nullable<string>,
    refreshToken: Nullable<string>
  ): EndSessionRequest {
    return new EndSessionRequest(triggeredBy, accessToken, refreshToken);
  }

  protected validatePayload(): void {
    // no validation needed
  }
}

export { EndSessionRequest };
