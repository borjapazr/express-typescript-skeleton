import { Req } from '@tsed/common';

import { AppConfig } from '@contract/rest/config';
import { Nullable } from '@shared/domain';

const RequestUtils = {
  getAccessToken: (request: Req): Nullable<string> => {
    const authorizationAccessTokenHeader = request.get(AppConfig.AUTHORIZATION_ACCESS_TOKEN_HEADER_NAME);
    const accessTokenHeader = request.get(AppConfig.ACCESS_TOKEN_HEADER_NAME);
    const accessTokenCookie = request.cookies[AppConfig.ACCESS_TOKEN_COOKIE_NAME];

    return authorizationAccessTokenHeader
      ? authorizationAccessTokenHeader.replace('Bearer ', '')
      : accessTokenHeader || accessTokenCookie || null;
  },

  getRefreshToken: (request: Req): Nullable<string> => {
    const refreshTokenHeader = request.get(AppConfig.REFRESH_TOKEN_HEADER_NAME);
    const refreshTokenCookie = request.cookies[AppConfig.REFRESH_TOKEN_COOKIE_NAME];

    return refreshTokenHeader || refreshTokenCookie || null;
  }
};

export { RequestUtils };
