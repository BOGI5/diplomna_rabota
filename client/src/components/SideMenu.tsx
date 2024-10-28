import { Sidebar } from "primereact/sidebar";
import { Avatar } from "primereact/avatar";
import { useAuthState } from "../contexts/AuthContext";

interface SideMenuProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideMenu({ visible, setVisible }: SideMenuProps) {
  const { user } = useAuthState();

  return (
    <Sidebar
      visible={visible}
      position="left"
      header={
        <>
          <a href="users/me">
            <Avatar icon="pi pi-user" shape="circle" size="large" />
          </a>
          <h2>{user?.firstName + " " + user?.lastName}</h2>
        </>
      }
      onHide={() => setVisible(false)}
    >
      <h1>Sidebar</h1>
    </Sidebar>
  );
}
