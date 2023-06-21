import { UseAuth } from '@tsed/common';
import { useDecorators } from '@tsed/core';
import { Returns, Security } from '@tsed/schema';
import { StatusCodes } from 'http-status-codes';

import { ExceptionApiResponse } from '@presentation/rest/exceptions';
import { AuthenticationMiddleware } from '@presentation/rest/middlewares';

interface AuthOptions extends Record<string, unknown> {
  roles?: string[];
}

const WithAuth = (options: AuthOptions = {}): any => {
  return useDecorators(
    UseAuth(AuthenticationMiddleware, options),
    Security('Bearer'),
    Returns(StatusCodes.UNAUTHORIZED, ExceptionApiResponse),
    Returns(StatusCodes.FORBIDDEN, ExceptionApiResponse)
  );
};

export { WithAuth };
