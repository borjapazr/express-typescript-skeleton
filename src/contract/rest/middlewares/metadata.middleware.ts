import { Context, Middleware, MiddlewareMethods, OnResponse, Req } from '@tsed/common';

import { AppConfig } from '@contract/rest/config';
import { RequestUtils } from '@contract/rest/shared/request.utils';
import { Token, TokenProviderDomainService } from '@modules/sessions/domain/tokens';
import { Nullable } from '@shared/domain';
import { TriggeredByAnonymous, TriggeredByUser } from '@shared/domain/entities/triggered-by';
import { Authentication } from '@shared/infrastructure/authentication';
import { AuthenticationUtils } from '@shared/infrastructure/authentication/authentication-utils';

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
