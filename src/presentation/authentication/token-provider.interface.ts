import { Token } from '@presentation/authentication/token';

interface TokenProvider {
  createAccessToken(userId: number | string, username: string, email: string, roles: string[]): Token;
  createRefreshToken(userId: number | string, username: string, email: string): Token;
  validateAccessToken(token: string): boolean;
  validateRefreshToken(token: string): boolean;
  parseToken(token: string): Token | undefined;
  getTokenFromHeader(header: string): string;
}

export { TokenProvider };
