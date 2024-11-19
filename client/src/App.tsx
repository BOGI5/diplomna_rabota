import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primeicons/primeicons.css";
import { Route, Routes } from "react-router-dom";
import { useAuthState } from "./contexts/AuthContext";
import Auth from "./pages/auth";
import HandleJWT from "./pages/auth/handleGoogleOauth";
import Header from "./components/Header";
import { SignFormProvider } from "./contexts/SignFormContext";
import Home from "./pages/home";

function App() {
  const { user } = useAuthState();
  return (
    <>
      {user && <Header />}
      <Routes>
        <Route
          path="auth"
          element={
            <SignFormProvider>
              <Auth />
            </SignFormProvider>
          }
        />
        <Route path="auth/handle-google-oauth" element={<HandleJWT />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
