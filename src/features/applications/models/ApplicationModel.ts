export interface ApplicationModel {
  code: string;
  name: string;
  logoUri: string;
  includeClient: boolean;
  applicationUri: string;
  signinRedirectUri: string;
  refreshRedirectUri: string;
  postLogoutRedirectUri: string;
  accessTokenLifetime: number;
}
