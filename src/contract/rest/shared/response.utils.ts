import { Res } from '@tsed/common';

import { AppConfig } from '@contract/rest/config';
import { AccessToken, RefreshToken } from '@modules/sessions/domain/tokens';
import { Nullable } from '@shared/domain';
import { GlobalConfig } from '@shared/infrastructure/config';

const ResponseUtils = {
  attachAccessAndRefreshTokens: (
    response: Res,
    accessToken: Nullable<AccessToken>,
    refreshToken?: Nullable<RefreshToken>
  ): void => {
    if (accessToken != null) {
      response.set(AppConfig.ACCESS_TOKEN_HEADER_NAME, accessToken.value);

      response.cookie(AppConfig.ACCESS_TOKEN_COOKIE_NAME, accessToken.value, {
        httpOnly: true,
        expires: accessToken.expiresAt.value,
        secure: GlobalConfig.IS_PRODUCTION
      });
    }

    if (refreshToken != null) {
      response.set(AppConfig.REFRESH_TOKEN_HEADER_NAME, refreshToken.value);

      response.cookie(AppConfig.REFRESH_TOKEN_COOKIE_NAME, refreshToken.value, {
        httpOnly: true,
        expires: refreshToken.expiresAt.value,
        secure: GlobalConfig.IS_PRODUCTION
      });
    }
  },

  clearAccessAndRefreshTokens: (response: Res): void => {
    response.set(AppConfig.ACCESS_TOKEN_HEADER_NAME, 'deleted');
    response.clearCookie(AppConfig.ACCESS_TOKEN_COOKIE_NAME);

    response.set(AppConfig.REFRESH_TOKEN_HEADER_NAME, 'deleted');
    response.clearCookie(AppConfig.REFRESH_TOKEN_COOKIE_NAME);
  }
};

export { ResponseUtils };
