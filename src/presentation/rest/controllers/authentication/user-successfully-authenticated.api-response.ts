import { CollectionOf, Email, Property } from '@tsed/schema';

import { SessionResponse } from '@application/sessions';

class UserSuccessfullyAuthenticatedApiResponse {
  @Property()
  readonly uuid: string;

  @Property()
  readonly username: string;

  @Email()
  readonly email: string;

  @CollectionOf(String)
  readonly roles: string[];

  @Property()
  readonly accessToken: string;

  @Property()
  readonly refreshToken: string;

  constructor(
    uuid: string,
    username: string,
    email: string,
    roles: string[],
    accessToken: string,
    refreshToken: string
  ) {
    this.uuid = uuid;
    this.username = username;
    this.email = email;
    this.roles = roles;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public static create(
    uuid: string,
    username: string,
    email: string,
    roles: string[],
    accessToken: string,
    refreshToken: string
  ): UserSuccessfullyAuthenticatedApiResponse {
    return new UserSuccessfullyAuthenticatedApiResponse(uuid, username, email, roles, accessToken, refreshToken);
  }

  public static fromSessionResponse(
    sessionInformationHolder: SessionResponse
  ): UserSuccessfullyAuthenticatedApiResponse {
    return new UserSuccessfullyAuthenticatedApiResponse(
      sessionInformationHolder.session.userUuid.value,
      sessionInformationHolder.session.userData.username,
      sessionInformationHolder.session.userData.email,
      sessionInformationHolder.session.userData.roles,
      sessionInformationHolder.accessToken.value,
      sessionInformationHolder.refreshToken.value
    );
  }
}

export { UserSuccessfullyAuthenticatedApiResponse };
