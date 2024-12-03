import { Avatar } from "primereact/avatar";
import { Menubar } from "primereact/menubar";
import { SplitButton } from "primereact/splitbutton";
import { useAuthState } from "../contexts/AuthContext";
import environment from "../environment";
import { useEffect, useState } from "react";

export default function Header() {
  const { user } = useAuthState();
  const { logoutUser } = useAuthState();
  const [username, setUsername] = useState<string>(
    `${user?.firstName} ${user?.lastName}`
  );
  useEffect(() => {
    setUsername(`${user?.firstName} ${user?.lastName}`);
  }, [user]);
  return (
    <Menubar
      model={[
        {
          label: "Home",
          icon: "pi pi-home",
          command: () => {
            window.location.href = `${environment.clientUrl}`;
          },
        },
        {
          label: "Projects",
          icon: "pi pi-folder",
        },
        {
          label: "Tasks",
          icon: "pi pi-clipboard",
        },
        {
          label: "Stats",
          icon: "pi pi-chart-bar",
        },
        {
          label: "About us",
          icon: "pi pi-users",
        },
      ]}
      end={
        <div style={{ display: "flex", justifyContent: "content" }}>
          <a
            href={`${environment.clientUrl}${environment.clientProfileUrl}`}
            style={{
              display: "flex",
              justifyContent: "content",
              textDecoration: "none",
            }}
          >
            <Avatar
              icon="pi pi-user"
              image={`${user?.picture}`}
              shape="circle"
              size="large"
              style={{ color: "#2dd4bf", background: "transparent" }}
            />
          </a>
          <SplitButton
            text
            label={username}
            onClick={() => {
              window.location.href = `${environment.clientUrl}${environment.clientProfileUrl}`;
            }}
            model={[
              {
                label: "Logout",
                icon: "pi pi-sign-out",
                command: () => logoutUser(),
              },
              {
                label: "Profile",
                icon: "pi pi-user",
                command: () => {
                  window.location.href = `${environment.clientUrl}${environment.clientProfileUrl}`;
                },
              },
              {
                label: "Settings",
                icon: "pi pi-cog",
                command: () => {
                  window.location.href = `${environment.clientUrl}/settings`;
                },
              },
            ]}
          />
        </div>
      }
    />
  );
}
