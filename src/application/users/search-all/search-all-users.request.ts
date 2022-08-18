import { UseCaseRequest } from '@application/shared';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';

class SearchAllUsersRequest extends UseCaseRequest {
  public static create(triggeredBy: TriggeredBy): SearchAllUsersRequest {
    return new SearchAllUsersRequest(triggeredBy);
  }

  protected validatePayload(): void {
    // no validation needed
  }
}

export { SearchAllUsersRequest };
