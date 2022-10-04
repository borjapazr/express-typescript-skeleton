import { Catch, ExceptionFilterMethods, PlatformContext, PlatformResponse } from '@tsed/common';
import { Exception } from '@tsed/exceptions';

import { LOGGER } from '@domain/shared';
import {
  ApiException,
  ExceptionResponse,
  InternalServerErrorException,
  ResourceNotFoundException,
  UnauthorizedException
} from '@presentation/exceptions';

@Catch(Exception)
@Catch(Error)
class HttpExceptionFilter implements ExceptionFilterMethods {
  public catch(error: Error, context: PlatformContext): void {
    const { response } = context;

    return this.getExceptionHandler(error)(response, error);
  }

  private getExceptionHandler = (exception: Error): ((response: PlatformResponse, error: Error) => void) => {
    const invalidCredentialsHandler = (response: PlatformResponse, _error: Error): void => {
      const unauthorizedException = new UnauthorizedException();
      response.status(unauthorizedException.status).body(ExceptionResponse.fromApiException(unauthorizedException));
    };

    const userNotFoundHandler = (response: PlatformResponse, error: Error): void => {
      const resourceNotFoundException = new ResourceNotFoundException(error.message);
      response
        .status(resourceNotFoundException.status)
        .body(ExceptionResponse.fromApiException(resourceNotFoundException));
    };

    const invalidSessionHandler = (response: PlatformResponse, _error: Error): void => {
      const unauthorizedException = new UnauthorizedException();
      response.status(unauthorizedException.status).body(ExceptionResponse.fromApiException(unauthorizedException));
    };

    const defaultHandler = (response: PlatformResponse, error: Error): void => {
      if (error instanceof ApiException) {
        const apiException = error as ApiException;
        response.status(apiException.status).body(ExceptionResponse.fromApiException(apiException));
      } else {
        LOGGER.error(`[@ErrorHandler] ${this.constructor.name}.catch() threw the following error! --- ${error}`);
        const internalServerErrorException = new InternalServerErrorException();
        response
          .status(internalServerErrorException.status)
          .body(ExceptionResponse.fromApiException(internalServerErrorException));
      }
    };

    const exceptionHandlers: { [exception: string]: (response: PlatformResponse, error: Error) => void } = {
      InvalidAuthenticationUsernameException: invalidCredentialsHandler,
      InvalidAuthenticationCredentialsException: invalidCredentialsHandler,
      UserNotExistsException: userNotFoundHandler,
      InvalidSessionException: invalidSessionHandler,
      DefaultException: defaultHandler
    };

    return exceptionHandlers[exception.name || exception.constructor.name] || exceptionHandlers.DefaultException;
  };
}

export { HttpExceptionFilter };
