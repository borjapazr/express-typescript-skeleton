import { Catch, ExceptionFilterMethods, PlatformContext, Res } from '@tsed/common';
import { Exception, Exception as TsEdException } from '@tsed/exceptions';

import { Logger } from '@domain/shared';
import {
  ApiException,
  ExceptionResponse,
  InternalServerErrorException,
  ResourceNotFoundException,
  UnauthorizedException
} from '@presentation/rest/exceptions';

@Catch(Exception)
@Catch(Error)
class HttpExceptionFilter implements ExceptionFilterMethods {
  public catch(error: Error, context: PlatformContext): void {
    const { response } = context;

    return this.getExceptionHandler(error)(response.raw, error);
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
        Logger.error(`[@ErrorHandler] ${this.constructor.name}.catch() threw the following error! --- ${error}`);
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

export { HttpExceptionFilter };
