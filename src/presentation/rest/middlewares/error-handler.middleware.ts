import { Err, Middleware, MiddlewareMethods, Next, Req, Res } from '@tsed/common';
import { NextFunction, Request, Response } from 'express';

import {
  ApiException,
  ExceptionResponse,
  ResourceNotFoundException,
  UnauthorizedException
} from '@presentation/rest/exceptions';
import { InternalServerErrorException } from '@presentation/rest/exceptions/internal-server-error.exception';

@Middleware()
class ErrorHandlerMiddleware implements MiddlewareMethods {
  public use(
    @Err() error: Error,
    @Req() _request: Request,
    @Res() response: Response,
    @Next() _next: NextFunction
  ): void {
    return this.getExceptionHandler(error)(response, error);
  }

  private getExceptionHandler = (exception: Error): ((response: Response, error: Error) => void) => {
    const invalidCredentialsHandler = (response: Response, _error: Error): void => {
      const unauthorizedException = new UnauthorizedException();
      response.status(unauthorizedException.status).send(ExceptionResponse.fromApiException(unauthorizedException));
    };

    const userNotFoundHandler = (response: Response, error: Error): void => {
      const resourceNotFoundException = new ResourceNotFoundException(error.message);
      response
        .status(resourceNotFoundException.status)
        .send(ExceptionResponse.fromApiException(resourceNotFoundException));
    };

    const invalidSessionHandler = (response: Response, _error: Error): void => {
      const unauthorizedException = new UnauthorizedException();
      response.status(unauthorizedException.status).send(ExceptionResponse.fromApiException(unauthorizedException));
    };

    const defaultHandler = (response: Response, error: Error): void => {
      if (error instanceof ApiException) {
        const apiException = error as ApiException;
        response.status(apiException.status).send(ExceptionResponse.fromApiException(apiException));
      } else {
        const internalServerErrorException = new InternalServerErrorException();
        response
          .status(internalServerErrorException.status)
          .send(ExceptionResponse.fromApiException(internalServerErrorException));
      }
    };

    const exceptionHandlers: { [exception: string]: (response: Response, error: Error) => void } = {
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
