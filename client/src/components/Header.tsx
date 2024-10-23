import { Menubar } from "primereact/menubar";
import { useAuthState } from "../pages/login/state/state";

export default function Header() {
  return (
    <header>
      <Menubar
        model={[
          {
            label: "Logout",
            icon: "pi pi-sign-out",
            command: () => {
              useAuthState.getState().removeUser();
            },
          },
        ]}
      />
    </header>
  );
}
