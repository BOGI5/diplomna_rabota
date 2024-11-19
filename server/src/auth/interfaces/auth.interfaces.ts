export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
}

export type UserFromJwt = {
  id: string;
  sub: string;
};
