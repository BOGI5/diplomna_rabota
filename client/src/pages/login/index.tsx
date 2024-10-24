import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { ToggleButton } from "primereact/togglebutton";
import RegistrationForm from "../../components/RegistrationForm";
import LoginForm from "../../components/LoginForm";
import environment from "../../environment";

export default function Login() {
  const onGoogleLogin = () => {
    window.location.href = `${environment.apiUrl}/auth/google`;
  };
  const [visible, setVisible] = useState(true);
  const [smallScreen, setSmallScreen] = useState(false);
  const [accountNotExists, setAccountNotExists] = useState(false);
  onresize = () => {
    if (window.innerWidth < 600) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  };
  return (
    <>
      <Dialog
        modal
        visible={visible}
        onHide={() => {}}
        draggable={false}
        resizable={false}
        className="border-solid border-round-bottom border-3 border-50"
        content={() => (
          <div className="p-dialog-content block">
            <form action="" onSubmit={() => setVisible(false)}>
              {accountNotExists ? <RegistrationForm /> : <LoginForm />}
              <div
                className={
                  accountNotExists && !smallScreen ? "flex flex-wrap" : ""
                }
              >
                <ToggleButton
                  onLabel="I already have an account"
                  offLabel="I don't have an account"
                  onIcon="pi pi-user"
                  offIcon="pi pi-user-plus"
                  checked={accountNotExists}
                  onChange={(e) => setAccountNotExists(e.value)}
                  className={
                    accountNotExists && !smallScreen
                      ? "w-auto mr-2"
                      : "w-full mb-3"
                  }
                />

                <div
                  className={
                    accountNotExists && !smallScreen
                      ? "w-auto ml-3"
                      : "w-auto flex"
                  }
                >
                  <Button
                    label="Reset"
                    type="reset"
                    icon="pi pi-refresh"
                    text
                    raised
                    className={
                      accountNotExists && !smallScreen
                        ? "mr-2 w-auto"
                        : "flex mr-2 w-6"
                    }
                  />
                  <Button
                    label="Submit"
                    type="submit"
                    icon="pi pi-check"
                    className={
                      accountNotExists && !smallScreen
                        ? "ml-2 w-auto"
                        : "flex ml-3 w-6"
                    }
                  />
                </div>
              </div>
            </form>
            <Divider type="solid" align="center">
              <strong>OR</strong>
            </Divider>

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
