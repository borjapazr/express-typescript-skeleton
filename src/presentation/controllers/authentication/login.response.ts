class LoginResponse {
  constructor(
    readonly userId: number,
    readonly username: string,
    readonly email: string,
    readonly roles: string[],
    readonly accessToken: string,
    readonly refreshToken: string
  ) {}
}

export { LoginResponse };
