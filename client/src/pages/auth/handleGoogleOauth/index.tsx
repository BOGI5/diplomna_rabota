import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthState } from "../../../contexts/AuthContext";

const HandleGoogleOauth = () => {
  const [params] = useSearchParams();
  const { setUser } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    const user = params.get("user");
    if (user) {
      setUser(JSON.parse(decodeURIComponent(user)));
    }

    navigate("/");
  }, [navigate, params, setUser]);

  return <div>Logging in...</div>;
};

export default HandleGoogleOauth;
