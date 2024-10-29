import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primeicons/primeicons.css";
import { Route, Routes } from "react-router-dom";
import { useAuthState } from "./contexts/AuthContext";
import Auth from "./pages/auth";
import HandleJWT from "./pages/auth/handleJwt";
import Header from "./components/Header";
import { SignFormProvider } from "./contexts/SignFormContext";

function App() {
  const { user } = useAuthState();
  return (
    <>
      <Routes>
        <Route path="auth" element={<Auth />} />
        <Route path="auth/handle-jwt" element={<HandleJWT />} />
      </Routes>
      {user ? (
        <Header />
      ) : (
        <SignFormProvider>
          <Auth />
        </SignFormProvider>
      )}
    </>
  );
}

export default App;
