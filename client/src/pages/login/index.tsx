import { Toast } from "primereact/toast";
import { ButtonGroup } from "primereact/buttongroup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { useRef, useState } from "react";
import LoginForm from "../../components/LoginForm";
import RegistrationForm from "../../components/RegistrationForm";
import environment from "../../environment";

export default function Login() {
  // TODO - add if state for width 500px
  const onGoogleLogin = () => {
    window.location.href = `${environment.apiUrl}/auth/google`;
  };
  const [visible, setVisible] = useState(true);
  const warning = useRef(null);
  const [accountNotExists, setAccountNotExists] = useState(false);
  const showWarning = () => {
    warning.current.show({
      severity: "warn",
      summary: "Warning",
      detail: "You need to login for access to the website!",
    });
  };
  return (
    <>
      <Toast ref={warning} />
      <Dialog
        modal
        visible={visible}
        onHide={() => {
          if (!visible) return;
          showWarning();
        }}
        header={"Login"}
      >
        <form action="" onSubmit={() => setVisible(false)}>
          {accountNotExists ? <RegistrationForm /> : <LoginForm />}

          <ToggleButton
            offLabel="I already have an account"
            onLabel="I don't have an account"
            offIcon="pi pi-check"
            onIcon="pi pi-times"
            checked={accountNotExists}
            onChange={(e) => setAccountNotExists(e.value)}
          />
          {!accountNotExists && (
            <>
              <br />
              <br />
            </>
          )}

          <ButtonGroup>
            <Button label="Reset" type="reset" outlined />
            <Button label="Submit" type="submit" />
          </ButtonGroup>
        </form>
        <br />

        <Button
          icon="pi pi-google"
          iconPos="right"
          label="Sign in with "
          severity="info"
          size="large"
          style={{ width: "100%" }}
          outlined
          onClick={onGoogleLogin}
        />
      </Dialog>
    </>
  );
}
