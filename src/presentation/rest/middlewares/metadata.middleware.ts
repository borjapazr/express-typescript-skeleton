import { Context, Middleware, MiddlewareMethods, OnResponse, Req } from '@tsed/common';

import { Token, TokenProviderDomainService } from '@domain/sessions/tokens';
import { Nullable } from '@domain/shared';
import { TriggeredByAnonymous, TriggeredByUser } from '@domain/shared/entities/triggered-by';
import { Authentication } from '@infrastructure/shared/authentication';
import { AuthenticationUtils } from '@infrastructure/shared/authentication/authentication-utils';
import { AppConfig } from '@presentation/rest/config';
import { RequestUtils } from '@presentation/rest/shared/request.utils';

@Middleware()
class MetadataMiddleware implements MiddlewareMethods, OnResponse {
  private tokenProviderDomainService: TokenProviderDomainService;

  constructor(tokenProviderDomainService: TokenProviderDomainService) {
    this.tokenProviderDomainService = tokenProviderDomainService;
  }

  public use(@Req() request: Req, @Context() context: Context): void {
    let triggeredBy = new TriggeredByAnonymous();
    let authentication = Authentication.createEmpty();

    const accessTokenString = RequestUtils.getAccessToken(request);
    const refreshTokenString = RequestUtils.getRefreshToken(request);
    const accessToken = accessTokenString ? this.tokenProviderDomainService.parseAccessToken(accessTokenString) : null;
    const refreshToken = refreshTokenString
      ? this.tokenProviderDomainService.parseRefreshToken(refreshTokenString)
      : null;
    const token: Nullable<Token> = accessToken || refreshToken;

    if (token) {
      const userRoles = token.roles.map(role => role.value);
      triggeredBy = new TriggeredByUser(token.username.value, userRoles);
      authentication = Authentication.create(token.userUuid.value, token.username.value, token.email.value, userRoles);
    }

    AuthenticationUtils.setAuthentication(authentication);
    context.set(AppConfig.AUTHENTICATION_CONTEXT_KEY, authentication);
    context.set(AppConfig.TRIGGERED_BY_CONTEXT_KEY, triggeredBy);
  }

  public $onResponse(): void {
    AuthenticationUtils.clearAuthentication();
  }
}

export { MetadataMiddleware };
