import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import ApiService from "../services/api";
import environment from "../environment";
import { useNotification } from "../contexts/NotificationContext";

interface ChangePasswordProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export default function ChangePassword({
  visible,
  setVisible,
}: ChangePasswordProps) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const { showMessage } = useNotification();

  return (
    <Dialog
      visible={visible}
      onHide={() => setVisible(false)}
      draggable={false}
      header="Change Password"
    >
      <form
        className="flex flex-column gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (passwords.newPassword !== passwords.confirm) {
            showMessage({
              severity: "error",
              summary: "Error",
              detail: "Passwords do not match",
            });
            return;
          }
          if (passwords.newPassword === passwords.currentPassword) {
            showMessage({
              severity: "error",
              summary: "Error",
              detail: "New password cannot be the same as the current password",
            });
            return;
          }
          new ApiService()
            .patch(environment.updatePasswordUrl, {
              currentPassword: passwords.currentPassword,
              newPassword: passwords.newPassword,
            })
            .then(
              (res) => {
                if (res.status === 200) {
                  setVisible(false);
                  setPasswords({
                    currentPassword: "",
                    newPassword: "",
                    confirm: "",
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
              }
            );
        }}
        onReset={() =>
          setPasswords({
            currentPassword: "",
            newPassword: "",
            confirm: "",
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
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, currentPassword: e.target.value })
            }
            required
          />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-hashtag"></i>
          </span>
          <InputText
            placeholder="New password"
            type="password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            required
          />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-hashtag"></i>
          </span>
          <InputText
            placeholder="Confirm password"
            type="password"
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm: e.target.value })
            }
            required
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
