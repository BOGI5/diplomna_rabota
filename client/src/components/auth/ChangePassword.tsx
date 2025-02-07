import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { confirmPopup } from "primereact/confirmpopup";
import { useState } from "react";
import ApiService from "../../services/api";
import environment from "../../environment";
import { useNotificationContext } from "../../contexts/NotificationContext";

interface ChangePasswordProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export default function ChangePassword({
  visible,
  setVisible,
}: ChangePasswordProps) {
  const [passwords, setPasswords] = useState({
    current: { password: "", error: false },
    new: { password: "", error: false },
    confirm: { password: "", error: false },
  });
  const { showMessage } = useNotificationContext();

  return (
    <Dialog
      visible={visible}
      onHide={() => {
        setVisible(false);
        setPasswords({
          current: { password: "", error: false },
          new: { password: "", error: false },
          confirm: { password: "", error: false },
        });
      }}
      draggable={false}
      header="Change Password"
    >
      <form
        className="flex flex-column gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (passwords.new.password !== passwords.confirm.password) {
            showMessage({
              severity: "error",
              summary: "Error",
              detail: "Passwords do not match",
            });
            setPasswords({
              ...passwords,
              new: { ...passwords.new, error: true },
              confirm: { ...passwords.confirm, error: true },
            });
            return;
          }
          if (passwords.new.password === passwords.current.password) {
            showMessage({
              severity: "error",
              summary: "Error",
              detail: "New password cannot be the same as the current password",
            });
            setPasswords({
              ...passwords,
              new: { ...passwords.new, error: true },
              current: { ...passwords.current, error: true },
              confirm: { ...passwords.current, error: true },
            });
            return;
          }
          confirmPopup({
            target: e.currentTarget,
            message: "Are you sure you want to change your password?",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-warning",
            rejectClassName: "p-button-outlined p-button-warning",
            accept: () => {
              new ApiService()
                .patch(environment.updatePasswordUrl, {
                  currentPassword: passwords.current.password,
                  newPassword: passwords.new.password,
                })
                .then(
                  (res) => {
                    if (res.status === 200) {
                      setVisible(false);
                      setPasswords({
                        current: { password: "", error: false },
                        new: { password: "", error: false },
                        confirm: { password: "", error: false },
                      });
                      showMessage({
                        severity: "success",
                        summary: "Success",
                        detail: "Password updated successfully",
                      });
                    }
                  },
                  (err) => {
                    showMessage({
                      severity: "error",
                      summary: "Error",
                      detail: err.response.data.message,
                    });
                    if (
                      err.response.data.message
                        .toLocaleLowerCase()
                        .includes("invalid credentials")
                    ) {
                      setPasswords({
                        ...passwords,
                        current: { ...passwords.current, error: true },
                      });
                    }
                  }
                );
            },
          });
        }}
        onReset={() =>
          setPasswords({
            current: { password: "", error: false },
            new: { password: "", error: false },
            confirm: { password: "", error: false },
          })
        }
      >
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-lock"></i>
          </span>
          <InputText
            placeholder="Current password"
            type="password"
            value={passwords.current.password}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                current: { password: e.target.value, error: false },
              })
            }
            required
            invalid={passwords.current.error}
          />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-hashtag"></i>
          </span>
          <InputText
            placeholder="New password"
            type="password"
            value={passwords.new.password}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                new: { password: e.target.value, error: false },
              })
            }
            required
            invalid={passwords.new.error}
          />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-hashtag"></i>
          </span>
          <InputText
            placeholder="Confirm password"
            type="password"
            value={passwords.confirm.password}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                confirm: { password: e.target.value, error: false },
              })
            }
            required
            invalid={passwords.confirm.error}
          />
        </div>
        <div className="flex justify-content-center gap-3 mt-2">
          <Button
            label="Reset"
            icon="pi pi-refresh"
            type="reset"
            severity="warning"
            text
            raised
          />
          <Button
            label="Change"
            icon="pi pi-check"
            type="submit"
            severity="warning"
          />
        </div>
      </form>
    </Dialog>
  );
}
