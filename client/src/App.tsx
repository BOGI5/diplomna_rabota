import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primeicons/primeicons.css";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import GoogleOAuthSuccessRedirect from "./pages/google-oauth-success-redirect/google-oauth-success-redirect";
import { useAuthState } from "./contexts/AuthContext";
import Header from "./components/Header";

function App() {
  const { user } = useAuthState();
  return (
    <>
      <Routes>
        <Route path="auth" element={<Auth />} />
        <Route
          path="auth/google-oauth-success-redirect"
          element={<GoogleOAuthSuccessRedirect />}
        />
      </Routes>
      {user ? <Header /> : <Auth />}
    </>
  );
}

export default App;
