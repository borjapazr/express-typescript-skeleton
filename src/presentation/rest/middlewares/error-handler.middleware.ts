import { Err, Middleware, MiddlewareMethods, Next, Req, Res } from '@tsed/common';
import { Exception as TsEdException } from '@tsed/exceptions';

import { LOGGER } from '@domain/shared';
import {
  ApiException,
  ExceptionResponse,
  ResourceNotFoundException,
  UnauthorizedException
} from '@presentation/rest/exceptions';
import { InternalServerErrorException } from '@presentation/rest/exceptions/internal-server-error.exception';

@Middleware()
class ErrorHandlerMiddleware implements MiddlewareMethods {
  public use(@Err() error: Error, @Req() _request: Req, @Res() response: Res, @Next() _next: Next): void {
    return this.getExceptionHandler(error)(response, error);
  }

  private getExceptionHandler = (exception: Error): ((response: Res, error: Error) => void) => {
    const invalidCredentialsHandler = (response: Res, _error: Error): void => {
      const unauthorizedException = new UnauthorizedException();
      response.status(unauthorizedException.status).send(ExceptionResponse.fromApiException(unauthorizedException));
    };

    const userNotFoundHandler = (response: Res, error: Error): void => {
      const resourceNotFoundException = new ResourceNotFoundException(error.message);
      response
        .status(resourceNotFoundException.status)
        .send(ExceptionResponse.fromApiException(resourceNotFoundException));
    };

    const invalidSessionHandler = (response: Res, _error: Error): void => {
      const unauthorizedException = new UnauthorizedException();
      response.status(unauthorizedException.status).send(ExceptionResponse.fromApiException(unauthorizedException));
    };

    const defaultHandler = (response: Res, error: Error): void => {
      if (error instanceof ApiException) {
        response.status(error.status).send(ExceptionResponse.fromApiException(error));
      } else if (error instanceof TsEdException) {
        response.status(error.status).send(ExceptionResponse.fromTsEdException(error));
      } else {
        LOGGER.error(`[@ErrorHandler] ${this.constructor.name}.catch() threw the following error! --- ${error}`);
        const internalServerErrorException = new InternalServerErrorException();
        response
          .status(internalServerErrorException.status)
          .send(ExceptionResponse.fromApiException(internalServerErrorException));
      }
    };

    const exceptionHandlers: { [exception: string]: (response: Res, error: Error) => void } = {
      InvalidAuthenticationUsernameException: invalidCredentialsHandler,
      InvalidAuthenticationCredentialsException: invalidCredentialsHandler,
      UserNotExistsException: userNotFoundHandler,
      InvalidSessionException: invalidSessionHandler,
      DefaultException: defaultHandler
    };

    return exceptionHandlers[exception.name || exception.constructor.name] || exceptionHandlers.DefaultException;
  };
}

export { ErrorHandlerMiddleware };
