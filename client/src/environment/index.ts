const environment = {
  apiUrl: "http://localhost:3000/api",
  oauthUrl: "/auth/google",
  createUserUrl: "/auth/sign-up",
  loginUserUrl: "/auth/sign-in",
  handleJwtUrl: "http://localhost:5173/auth/handle-jwt", //import.meta.env.VITE_REACT_APP_API_URL,
};

export default environment;
