import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { Divider } from "primereact/divider";
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
        draggable={false}
        resizable={false}
        className="border-solid border-round-bottom border-3 border-bluegray-900"
        content={() => (
          <div className="p-dialog-content">
            <h1>{!accountNotExists ? "Login" : "Registration"}</h1>
            <form action="" onSubmit={() => setVisible(false)}>
              {accountNotExists ? <RegistrationForm /> : <LoginForm />}

              <ToggleButton
                onLabel="I already have an account"
                offLabel="I don't have an account"
                onIcon="pi pi-user"
                offIcon="pi pi-user-plus"
                checked={accountNotExists}
                onChange={(e) => setAccountNotExists(e.value)}
                className={accountNotExists ? "w-auto mr-2" : "w-full mb-3"}
              />

              <span
                className={accountNotExists ? "w-auto ml-3" : "w-auto flex"}
              >
                <Button
                  label="Reset"
                  type="reset"
                  icon="pi pi-refresh"
                  text
                  raised
                  className={accountNotExists ? "mr-2 w-auto" : "flex mr-2 w-5"}
                />
                <Button
                  label="Submit"
                  type="submit"
                  icon="pi pi-check"
                  className={accountNotExists ? "ml-2 w-auto" : "flex ml-3 w-6"}
                />
              </span>
            </form>
            <Divider type="solid" />

            <Button
              icon="pi pi-google"
              iconPos="right"
              label="Sign in with "
              severity="info"
              size="large"
              className="mt-2 w-full"
              outlined
              onClick={onGoogleLogin}
            />
          </div>
        )}
      />
    </>
  );
}
