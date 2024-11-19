import axios from "axios";
import environment from "../../environment";
import { useAuthState } from "../../contexts/AuthContext";

export default function Home() {
  const { user } = useAuthState();
  if (!user) {
    window.location.href = `${environment.clientUrl}/auth`;
    return;
  }
  axios
    .get(`${environment.apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
  return (
    <>
      <h1>Home</h1>
    </>
  );
}
