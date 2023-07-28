import { BodyParams, Context, Req, Res } from '@tsed/common';
import { Delete, Description, Example, Get, Post, Returns, Status, Summary, Tags, Title } from '@tsed/schema';
import { StatusCodes } from 'http-status-codes';

import { SessionResponse } from '@application/sessions';
import { EndSessionRequest, EndSessionUseCase } from '@application/sessions/end';
import { RefreshSessionRequest, RefreshSessionUseCase } from '@application/sessions/refresh';
import { StartSessionRequest, StartSessionUseCase } from '@application/sessions/start';
import { UserResponse } from '@application/users';
import { AuthenticateUserRequest, AuthenticateUserUseCase } from '@application/users/authentication';
import { FindUserRequest, FindUserUseCase } from '@application/users/find';
import { Logger } from '@domain/shared';
import { TriggeredBy, TriggeredByUser } from '@domain/shared/entities/triggered-by';
import { Authentication } from '@infrastructure/shared/authentication';
import { AuthenticationUtils } from '@infrastructure/shared/authentication/authentication-utils';
import { AppConfig } from '@presentation/rest/config';
import { NoCredentialsProvidedException } from '@presentation/rest/exceptions';
import { RequestUtils } from '@presentation/rest/shared/request.utils';
import { ResponseUtils } from '@presentation/rest/shared/response.utils';
import { RestController } from '@presentation/rest/shared/rest-controller.decorator';
import { WithAuth } from '@presentation/rest/shared/with-auth.decorator';

import { AuthenticatedUserApiResponse } from './authenticated-user.api-response';
import { UserSuccessfullyAuthenticatedApiResponse } from './user-successfully-authenticated.api-response';

@RestController('/auth')
@Tags({ name: 'Authentication', description: 'Login and register users' })
class AuthenticationController {
  private authenticateUserUseCase: AuthenticateUserUseCase;

  private startSessionUseCase: StartSessionUseCase;

  private refreshSessionUseCase: RefreshSessionUseCase;

  private endSessionUseCase: EndSessionUseCase;

  private findUserUseCase: FindUserUseCase;

  constructor(
    authenticateUserUseCase: AuthenticateUserUseCase,
    startSessionUseCase: StartSessionUseCase,
    refreshSessionUseCase: RefreshSessionUseCase,
    endSessionUseCase: EndSessionUseCase,
    findUserUseCase: FindUserUseCase
  ) {
    this.authenticateUserUseCase = authenticateUserUseCase;
    this.startSessionUseCase = startSessionUseCase;
    this.refreshSessionUseCase = refreshSessionUseCase;
    this.endSessionUseCase = endSessionUseCase;
    this.findUserUseCase = findUserUseCase;
  }

  @Post('/login')
  @Title('Login')
  @Summary('User login')
  @Description('Endpoint to perform a user login to obtain access token and refresh token')
  @Returns(StatusCodes.OK, UserSuccessfullyAuthenticatedApiResponse)
  @Status(StatusCodes.OK, UserSuccessfullyAuthenticatedApiResponse)
  public async authenticateUser(
    @Res() response: Res,
    @Context() context: Context,
    @Example('janedoe') @BodyParams('username') username: string,
    @Example('123456') @BodyParams('password') password: string
  ): Promise<UserSuccessfullyAuthenticatedApiResponse> {
    let triggeredBy = new TriggeredByUser(username, []);

    const authenticatedUser = await this.authenticateUserUseCase.execute(
      AuthenticateUserRequest.create(triggeredBy, username, password)
    );

    this.attachMetadataToContext(context, authenticatedUser);

    triggeredBy = context.get(AppConfig.TRIGGERED_BY_CONTEXT_KEY);

    const startedSession = await this.startSessionUseCase.execute(
      StartSessionRequest.create(triggeredBy, authenticatedUser.uuid)
    );

    this.setCookiesAndHeadersIfSessionWasRefreshed(startedSession, response);

    return UserSuccessfullyAuthenticatedApiResponse.fromSessionResponse(startedSession);
  }

  @Post('/refresh')
  @Title('Refresh')
  @Summary('Refresh access token')
  @Description('Endpoint to update the access token and the refresh token')
  @Returns(StatusCodes.OK, UserSuccessfullyAuthenticatedApiResponse)
  @Status(StatusCodes.OK, UserSuccessfullyAuthenticatedApiResponse)
  public async refreshAccessToken(
    @Req() request: Req,
    @Res() response: Res,
    @Context(AppConfig.TRIGGERED_BY_CONTEXT_KEY) triggeredBy: TriggeredBy
  ): Promise<UserSuccessfullyAuthenticatedApiResponse> {
    const refreshTokenString = this.getRefreshTokenOrThrowNoCredentialsException(request);

    const refreshSessionRequest = RefreshSessionRequest.create(triggeredBy, refreshTokenString);

    const refreshedSession = await this.refreshSessionUseCase.execute(refreshSessionRequest);

    this.setCookiesAndHeadersIfSessionWasRefreshed(refreshedSession, response);

    return UserSuccessfullyAuthenticatedApiResponse.fromSessionResponse(refreshedSession);
  }

  @Delete('/logout')
  @Title('Logout')
  @Summary('User logout')
  @Description('Endpoint to perform a user logout and revoke a valid session')
  @Returns(StatusCodes.NO_CONTENT)
  @Status(StatusCodes.NO_CONTENT)
  public async revokeSession(
    @Req() request: Req,
    @Res() response: Res,
    @Context(AppConfig.TRIGGERED_BY_CONTEXT_KEY) triggeredBy: TriggeredBy
  ): Promise<void> {
    const accessTokenString = RequestUtils.getAccessToken(request);
    const refreshTokenString = RequestUtils.getRefreshToken(request);

    const endSessionRequest = EndSessionRequest.create(triggeredBy, accessTokenString, refreshTokenString);

    try {
      await this.endSessionUseCase.execute(endSessionRequest);
    } catch {
      Logger.warn('An attempt was made to revoke a session without a valid access or refresh token');
    } finally {
      ResponseUtils.clearAccessAndRefreshTokens(response);
    }
  }

  @Get('/me')
  @WithAuth()
  @Title('Me')
  @Summary('Authenticated user information')
  @Description(`Endpoint to obtain the authenticated user's details`)
  @Returns(StatusCodes.OK, AuthenticatedUserApiResponse)
  @Status(StatusCodes.OK, AuthenticatedUserApiResponse)
  public async me(
    @Context(AppConfig.TRIGGERED_BY_CONTEXT_KEY) triggeredBy: TriggeredBy,
    @Context(AppConfig.AUTHENTICATION_CONTEXT_KEY) { uuid }: Authentication
  ): Promise<AuthenticatedUserApiResponse | Record<string, unknown>> {
    const authenticatedUser = await this.findUserUseCase.execute(FindUserRequest.create(triggeredBy, uuid as string));

    return AuthenticatedUserApiResponse.fromUserResponse(authenticatedUser);
  }

  private getRefreshTokenOrThrowNoCredentialsException(request: Req): string {
    const refreshToken = RequestUtils.getRefreshToken(request);

    if (refreshToken == null) {
      throw new NoCredentialsProvidedException();
    }

    return refreshToken;
  }

  private setCookiesAndHeadersIfSessionWasRefreshed(sessionResponse: SessionResponse, response: Res): void {
    if (sessionResponse != null) {
      const { accessToken, refreshToken } = sessionResponse;

      ResponseUtils.attachAccessAndRefreshTokens(response, accessToken, refreshToken);
    }
  }

  private attachMetadataToContext(context: Context, userResponse: UserResponse): void {
    const authentication = Authentication.create(
      userResponse.uuid,
      userResponse.username,
      userResponse.email,
      userResponse.roles
    );
    context.set(AppConfig.AUTHENTICATION_CONTEXT_KEY, authentication);
    AuthenticationUtils.setAuthentication(authentication);

    const triggeredBy = new TriggeredByUser(userResponse.username, userResponse.roles);
    context.set(AppConfig.TRIGGERED_BY_CONTEXT_KEY, triggeredBy);
  }
}

export { AuthenticationController };
