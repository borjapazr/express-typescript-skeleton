import { Res } from '@tsed/common';
import { DateTime } from 'luxon';

import { AccessToken, RefreshToken } from '@domain/sessions/tokens';
import { Nullable } from '@domain/shared';
import { GlobalConfig } from '@infrastructure/shared/config';
import { AppConfig } from '@presentation/config';

const ResponseUtils = {
  attachAccessAndRefreshTokens: (
    response: Res,
    accessToken: Nullable<AccessToken>,
    refreshToken?: Nullable<RefreshToken>
  ): void => {
    if (accessToken != null) {
      response.set(AppConfig.ACCESS_TOKEN_HEADER_NAME, accessToken?.token);

      response.cookie(AppConfig.ACCESS_TOKEN_COOKIE_NAME, accessToken?.token, {
        httpOnly: true,
        expires: DateTime.fromSeconds(accessToken?.expiration).toJSDate(),
        secure: GlobalConfig.IS_PRODUCTION
      });
    }

    if (refreshToken != null) {
      response.set(AppConfig.REFRESH_TOKEN_HEADER_NAME, refreshToken?.token);

      response.cookie(AppConfig.REFRESH_TOKEN_COOKIE_NAME, refreshToken?.token, {
        httpOnly: true,
        expires: DateTime.fromSeconds(refreshToken?.expiration).toJSDate(),
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
