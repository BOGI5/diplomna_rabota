import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import AuthPage from './pages/auth/auth';
import GoogleOAuthSuccessRedirect from './pages/google-oauth-success-redirect/google-oauth-success-redirect';
import { useAuthState } from "./pages/auth/state/state";

function App() {
  const isLogged = useAuthState((state) => state.user !== null);
  return (
    <>
      <Routes>
        <Route path="auth" element={<AuthPage />} />
        <Route
          path="auth/google-oauth-success-redirect"
          element={<GoogleOAuthSuccessRedirect />}
        />
      </Routes>
      { isLogged ? ( <Header /> ) : ( <AuthPage/> ) }
    </>
  );
}

export default App;
