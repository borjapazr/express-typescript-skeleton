import { Action } from 'routing-controllers';

import { Token, TokenType } from '@presentation/authentication/token';

import { JwtTokenProvider } from './jwt-token-provider';

const tokenProvider = new JwtTokenProvider();

const checkRole = async (action: Action, roles: Array<string>): Promise<boolean> => {
  const token = tokenProvider.getTokenFromHeader(action.request.headers.authorization);
  const accessToken = tokenProvider.parseToken(token);
  return (
    accessToken !== undefined &&
    accessToken.type === TokenType.ACCESS &&
    (roles.length === 0 || roles.some(role => accessToken.roles !== undefined && accessToken.roles.includes(role)))
  );
};

const checkUser = async (action: Action): Promise<Token | undefined> => {
  const token = tokenProvider.getTokenFromHeader(action.request.headers.authorization);
  return tokenProvider.parseToken(token);
};

export { checkRole, checkUser, tokenProvider };
