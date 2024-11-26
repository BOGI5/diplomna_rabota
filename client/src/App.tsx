import "primeicons/primeicons.css";
import { Route, Routes } from "react-router-dom";
import { useAuthState } from "./contexts/AuthContext";
import { SignFormProvider } from "./contexts/SignFormContext";
import HandleJWT from "./pages/auth/handleGoogleOauth";
import Profile from "./pages/profile";
import Auth from "./pages/auth";
import Home from "./pages/home";
import Header from "./components/Header";
import environment from "./environment";

function App() {
  const { user } = useAuthState();
  if (
    !user &&
    !(
      window.location.pathname === environment.clientAuthUrl ||
      window.location.pathname === environment.clientOauthUrl
    )
  ) {
    window.location.href = `${environment.clientUrl}${environment.clientAuthUrl}`;
    return;
  }
  return (
    <>
      {user && <Header />}
      <Routes>
        <Route
          path={`${environment.clientAuthUrl}`}
          element={
            <SignFormProvider>
              <Auth />
            </SignFormProvider>
          }
        />
        <Route path={`${environment.clientOauthUrl}`} element={<HandleJWT />} />
        <Route path="/" element={<Home />} />
        <Route path={`${environment.clientProfileUrl}`} element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
