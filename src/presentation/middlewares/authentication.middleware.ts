import { Context, Middleware, MiddlewareMethods, Req, Res } from '@tsed/common';

import { ValidateSessionRequest, ValidateSessionUseCase } from '@application/sessions/validate';
import { ValidatedSessionResponse } from '@application/sessions/validate/validated-session.response';
import { TriggeredByUser } from '@domain/shared/entities/triggered-by';
import { Authentication } from '@infrastructure/shared/authentication/authentication';
import { AuthenticationUtils } from '@infrastructure/shared/authentication/authentication-utils';
import { AppConfig } from '@presentation/config';
import { ForbiddenException } from '@presentation/exceptions';
import { RequestUtils } from '@presentation/shared/request.utils';
import { ResponseUtils } from '@presentation/shared/response.utils';

@Middleware()
class AuthenticationMiddleware implements MiddlewareMethods {
  private validateSessionUseCase: ValidateSessionUseCase;

  constructor(validateSessionUseCase: ValidateSessionUseCase) {
    this.validateSessionUseCase = validateSessionUseCase;
  }

  public async use(@Req() request: Req, @Res() response: Res, @Context() context: Context): Promise<void> {
    const accessTokenString = RequestUtils.getAccessToken(request);
    const refreshTokenString = RequestUtils.getRefreshToken(request);

    const validateSessionRequest = ValidateSessionRequest.create(
      context.get(AppConfig.TRIGGERED_BY_CONTEXT_KEY),
      accessTokenString,
      refreshTokenString
    );
    const validatedSessionResponse = await this.validateSessionUseCase.execute(validateSessionRequest);

    this.ensureUserHasPrivileges(context, validatedSessionResponse);

    this.attachAccessAndRefreshTokensIfSessionWasRefreshed(response, validatedSessionResponse);

    this.attachMetadataToContext(context, validatedSessionResponse);
  }

  private ensureUserHasPrivileges(context: Context, validatedSessionResponse: ValidatedSessionResponse): void {
    const userRoles = validatedSessionResponse?.accessToken?.roles ?? [];
    const { allowedRoles = [] } = context.endpoint.get(AuthenticationMiddleware) || {};

    const userHasPrivileges =
      allowedRoles.length === 0 || allowedRoles.some((role: string) => userRoles.includes(role));

    if (!userHasPrivileges) {
      throw new ForbiddenException();
    }
  }

  private attachAccessAndRefreshTokensIfSessionWasRefreshed(
    response: Res,
    validatedSessionResponse: ValidatedSessionResponse
  ): void {
    if (validatedSessionResponse.wasRefreshed) {
      const { accessToken, refreshToken } = validatedSessionResponse;

      ResponseUtils.attachAccessAndRefreshTokens(response, accessToken, refreshToken);
    }
  }

  private attachMetadataToContext(context: Context, validatedSessionResponse: ValidatedSessionResponse): void {
    const { accessToken } = validatedSessionResponse;

    if (accessToken != null) {
      const authentication = Authentication.create(
        accessToken.userUuid,
        accessToken.username,
        accessToken.email,
        accessToken.roles ?? []
      );
      context.set(AppConfig.AUTHENTICATION_CONTEXT_KEY, authentication);
      AuthenticationUtils.setAuthentication(authentication);

      const triggeredBy = new TriggeredByUser(accessToken.username, accessToken.roles);
      context.set(AppConfig.TRIGGERED_BY_CONTEXT_KEY, triggeredBy);
    }
  }
}

export { AuthenticationMiddleware };
