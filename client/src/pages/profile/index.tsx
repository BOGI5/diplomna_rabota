import { useAuthState } from "../../contexts/AuthContext";
import ApiService from "../../services/api";

export default function Profile() {
  const { user } = useAuthState();
  new ApiService().get("/users").then((res) => console.log(res.data));

  return (
    <div>
      <h1>Hello {`${user?.firstName} ${user?.lastName}`}</h1>
      <img src={`${user?.picture}`} style={{ height: "50%" }} />
    </div>
  );
}
