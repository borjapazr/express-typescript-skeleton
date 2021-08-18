import { StatusCodes } from 'http-status-codes';
import { Authorized, BodyParam, CurrentUser, Get, HttpCode, JsonController, UseBefore } from 'routing-controllers';

import { tokenProvider } from '@presentation/authentication';
import { Token } from '@presentation/authentication/token';
import { AuthenticationMiddleware } from '@presentation/middlewares/authentication.middleware';

import { LoginResponse } from './login.response';

@JsonController('/auth')
class AuthenticationController {
  @Get('/login')
  @HttpCode(StatusCodes.OK)
  login(): LoginResponse {
    const user: any = {
      userId: 1,
      username: 'MrMars',
      email: 'mrmars@machine.space',
      roles: ['admin']
    };

    return new LoginResponse(
      user.userId,
      user.username,
      user.email,
      user.roles,
      tokenProvider.createAccessToken(user.userId, user.username, user.email, user.roles).token,
      tokenProvider.createRefreshToken(user.userId, user.username, user.email).token
    );
  }

  @Get('/refresh')
  @HttpCode(StatusCodes.OK)
  refreshToken(@BodyParam('refreshToken') refreshToken: string): LoginResponse | null {
    const isRefreshTokenValid = tokenProvider.validateRefreshToken(refreshToken);

    if (isRefreshTokenValid) {
      const user: any = {
        userId: 1,
        username: 'MrMars',
        email: 'mrmars@machine.space',
        roles: ['admin']
      };
      return new LoginResponse(
        user.userId,
        user.username,
        user.email,
        user.roles,
        tokenProvider.createAccessToken(user.userId, user.username, user.email, user.roles).token,
        refreshToken
      );
    }
    return null;
  }

  @Get('/protected')
  @UseBefore(AuthenticationMiddleware)
  @Authorized(['admin'])
  @HttpCode(StatusCodes.OK)
  protected(@CurrentUser() user?: Token): any {
    return {
      userId: user?.userId,
      username: user?.username,
      email: user?.email,
      roles: user?.roles,
      expiration: user?.expiration
    };
  }
}

export { AuthenticationController };
