const environment = {
  // API url
  apiUrl: "http://localhost:3000/api",
  // Auth url
  oauthUrl: "/auth/google",
  signUpUrl: "/auth/sign-up",
  signInUrl: "/auth/sign-in",
  signOutUrl: "/auth/sign-out",
  refreshCredentialsUrl: "/auth/refresh",
  //  User url
  getAll: "/users",
  getOne: "/users/:id",
  getSelf: "/users/me",
  updateSelf: "/users/me",
  deleteSelf: "/users/me",
  // Client url
  clientUrl: "http://localhost:5173",
  clientAuthUrl: "/auth",
  clientOauthUrl: "/auth/handle-google-oauth",
  clientProfileUrl: "/profile",
};

export default environment;
