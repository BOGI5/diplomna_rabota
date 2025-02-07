import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useNotificationContext } from "../contexts/NotificationContext";
import environment from "../environment";
import ApiService from "../services/api";

interface CreateProjectModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export default function CreateProjectModal(props: CreateProjectModalProps) {
  const apiService = new ApiService();
  const { showMessage } = useNotificationContext();
  const [projectName, setProjectName] = useState<string>("");
  return (
    <Dialog
      visible={props.visible}
      draggable={false}
      onHide={() => props.setVisible(false)}
      header="Create new project"
    >
      <form
        className="flex flex-column gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          if (projectName.length === 0) {
            showMessage({
              severity: "error",
              summary: "Error",
              detail: "Project name is required",
            });
            return;
          }
          apiService
            .post("/projects", {
              name: projectName,
            })
            .then(
              (res) => {
                window.location.href = `${environment.clientUrl}${environment.clientProjectsUrl}/${res.data.id}`;
              },
              (err) => {
                showMessage({
                  severity: "error",
                  summary: "Error",
                  detail: err.message,
                });
                props.setVisible(false);
              }
            );
        }}
      >
        <InputText
          className="mt-1"
          placeholder="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          invalid={projectName.length === 0}
        />
        <div className="flex flex-row justify-content-between gap-3">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={() => {
              setProjectName("");
              props.setVisible(false);
            }}
            type="button"
            className="p-button-text"
          />
          <Button label="Create" icon="pi pi-check" type="submit" />
        </div>
      </form>
    </Dialog>
  );
}
