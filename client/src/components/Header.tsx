import { Button } from "primereact/button";
import { useAuthState } from "../contexts/AuthContext";
import SideMenu from "./SideMenu";
import { useState } from "react";

export default function Header() {
  const [visible, setVisible] = useState(false);
  const { removeUser } = useAuthState();
  return (
    <header className="flex justify-content-between surface-100">
      <div>
        <Button icon="pi pi-align-left" onClick={() => setVisible(true)} />
        <SideMenu visible={visible} setVisible={setVisible} />
      </div>
      <Button
        label="Logout"
        icon="pi pi-sign-out"
        onClick={() => removeUser()}
      />
    </header>
  );
}
