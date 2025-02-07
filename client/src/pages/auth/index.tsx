import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { ToggleButton } from "primereact/togglebutton";
import LoginForm from "../../components/auth/LoginForm";
import { useSignState } from "../../contexts/SignFormContext";
import RegistrationForm from "../../components/auth/RegistrationForm";
import { useNotificationContext } from "../../contexts/NotificationContext";

export default function Auth() {
  const {
    visible,
    setFormData,
    formData,
    accountNotExists,
    setAccountNotExists,
    handleSubmit,
    smallScreen,
    onGoogleSignIn,
  } = useSignState();
  const { showMessage, clear } = useNotificationContext();

  return (
    <Dialog
      modal
      visible={visible}
      onHide={() => {}}
      draggable={false}
      resizable={false}
      className="border-solid border-round-bottom border-3 border-50"
      content={() => (
        <div className="p-dialog-content block">
          <form onSubmit={(e) => handleSubmit(e, showMessage)} onChange={clear}>
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
                onChange={(e) => {
                  setAccountNotExists(e.value);
                  setFormData({
                    firstName: { value: "", error: false },
                    lastName: { value: "", error: false },
                    email: { ...formData.email, error: false },
                    password: { ...formData.password, error: false },
                    confirmPassword: { value: "", error: false },
                  });
                }}
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
            onClick={onGoogleSignIn}
          />
        </div>
      )}
    />
  );
}
