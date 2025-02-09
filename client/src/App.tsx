import "primeicons/primeicons.css";
import { Route, Routes } from "react-router-dom";
import { useAuthContext } from "./contexts/AuthContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import { SignFormProvider } from "./contexts/SignFormContext";
import HandleJWT from "./pages/auth/handleGoogleOauth";
import Profile from "./pages/profile";
import Auth from "./pages/auth";
import Home from "./pages/home";
import Tasks from "./pages/tasks";
import Project from "./pages/project";
import Projects from "./pages/projects";
import Header from "./components/Header";
import environment from "./environment";

function App() {
  const { user } = useAuthContext();
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
          path={environment.clientAuthUrl}
          element={
            <SignFormProvider>
              <Auth />
            </SignFormProvider>
          }
        />
        <Route path={environment.clientOauthUrl} element={<HandleJWT />} />
        <Route path="/" element={<Home />} />
        <Route path={environment.clientProfileUrl} element={<Profile />} />
        <Route path={environment.clientProjectsUrl} element={<Projects />} />
        <Route path={environment.clientTasksUrl} element={<Tasks />} />
        <Route
          path={"/projects/:id"}
          element={
            <ProjectProvider>
              <Project />
            </ProjectProvider>
          }
        />
      </Routes>
    </>
  );
}

export default App;
