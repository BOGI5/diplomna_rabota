import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserDef, useAuthState } from "../../../contexts/AuthContext";

const HandleJwt = () => {
  const [params] = useSearchParams();
  const { setUser } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    const jwtUser = params.get("jwtUser");
    if (jwtUser) {
      const userFromJwt: UserDef = jwtDecode(jwtUser);
      if (userFromJwt) {
        setUser(userFromJwt);
      }
    }

    navigate("/");
  }, [navigate, params, setUser]);

  return <div>Logging in...</div>;
};

export default HandleJwt;
