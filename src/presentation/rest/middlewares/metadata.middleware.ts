import { Context, Middleware, MiddlewareMethods, OnResponse, Req } from '@tsed/common';

import { TokenProviderDomainService } from '@domain/sessions/tokens';
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

    if (accessTokenString != null) {
      const accessToken = this.tokenProviderDomainService.parseAccessToken(accessTokenString);

      if (accessToken != null) {
        const userRoles = accessToken.roles.map(role => role.value);

        triggeredBy = new TriggeredByUser(accessToken.username.value, userRoles);
        authentication = Authentication.create(
          accessToken.userUuid.value,
          accessToken.username.value,
          accessToken.email.value,
          userRoles
        );
      }
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
