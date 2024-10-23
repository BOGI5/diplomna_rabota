import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primeicons/primeicons.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import GoogleOAuthSuccessRedirect from "./pages/google-oauth-success-redirect/google-oauth-success-redirect";
import { useAuthState } from "./pages/login/state/state";
import Header from "./components/Header";

function App() {
  const isLogged = useAuthState((state) => state.user !== null);
  return (
    <>
      <Routes>
        <Route path="auth" element={<Login />} />
        <Route
          path="auth/google-oauth-success-redirect"
          element={<GoogleOAuthSuccessRedirect />}
        />
      </Routes>
      {isLogged ? <Header /> : <Login />}
    </>
  );
}

export default App;
