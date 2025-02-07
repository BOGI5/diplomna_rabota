import { useState } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { ToggleButton } from "primereact/togglebutton";
import { InputTextarea } from "primereact/inputtextarea";
import { useNotificationContext } from "../../../contexts/NotificationContext";
import { useProjectContext } from "../../../contexts/ProjectContext";
import ApiService from "../../../services/api";

interface ProjectSettingsProps {
  name: { value: string; error: boolean; edited: boolean };
  description: { value: string; error: boolean; edited: boolean };
  deadline: { value: Date | undefined; error: boolean; edited: boolean };
}

export default function ProjectSettings() {
  const apiService = new ApiService();
  const { project, updateProjectData } = useProjectContext();
  const { showMessage } = useNotificationContext();
  const [smallScreen, setSmallScreen] = useState(window.innerWidth < 650);
  const [editProject, setEditProject] = useState<ProjectSettingsProps>({
    name: { value: project?.name || "", error: false, edited: false },
    description: {
      value: project?.description || "",
      error: false,
      edited: false,
    },
    deadline: {
      value: project?.deadline ? new Date(project.deadline) : undefined,
      error: false,
      edited: false,
    },
  });
  const [edit, setEdit] = useState(false);

  onresize = () => {
    setSmallScreen(window.innerWidth < 650);
  };

  return (
    <div style={{ height: "calc(100vh - 188px)" }}>
      <div className="flex flex-row justify-content-between">
        {!(smallScreen && edit) && <h1 className="my-0">Settings</h1>}
        <div className="flex flex-row align-items-center gap-3">
          {edit && (
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="danger"
              onClick={() => {
                setEditProject({
                  name: {
                    ...editProject.name,
                    value: project?.name || "",
                  },
                  description: {
                    ...editProject.description,
                    value: project?.description || "",
                  },
                  deadline: {
                    ...editProject.deadline,
                    value: project?.deadline || new Date(),
                  },
                });
                setEdit(false);
              }}
              outlined
            />
          )}
          <ToggleButton
            onLabel="Save"
            offLabel="Edit"
            offIcon="pi pi-pen-to-square"
            onIcon="pi pi-cloud-upload  "
            checked={edit}
            onChange={async (e) => {
              if (edit) {
                let description,
                  name,
                  deadline = undefined;
                if (editProject.description.edited)
                  description = editProject.description.value;
                if (editProject.deadline.edited)
                  deadline = editProject.deadline.value;
                if (editProject.name.edited) name = editProject.name.value;
                await apiService
                  .patch(`/projects/${project?.id}`, {
                    removeDeadline:
                      deadline === undefined && editProject.deadline.edited,
                    description: description,
                    deadline: deadline,
                    name: name,
                  })
                  .then(
                    () => {
                      updateProjectData();
                      setEdit(false);
                    },
                    (err) => {
                      showMessage({
                        severity: "error",
                        summary: "Error",
                        detail: err.response.data.message,
                      });
                    }
                  );
              } else {
                setEdit(e.value);
              }
            }}
          />
        </div>
      </div>
      <div
        className={`flex flex-${
          smallScreen ? "column" : "row"
        } gap-3 justify-content-between`}
      >
        <div className="flex flex-column justify-content-center">
          {/* name, description, deadline, delete */}
          <FloatLabel className="mt-5">
            <InputText
              id="name"
              value={editProject.name.value}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  name: { value: e.target.value, error: false, edited: true },
                })
              }
              disabled={!edit}
              invalid={editProject.name.error}
            />
            <label htmlFor="name">Project Name</label>
          </FloatLabel>
          <FloatLabel className="mt-5">
            <InputTextarea
              id="description"
              value={editProject.description.value}
              invalid={editProject.description.error}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  description: {
                    value: e.target.value,
                    error: false,
                    edited: true,
                  },
                })
              }
              rows={5}
              cols={30}
              disabled={!edit}
            />
            <label htmlFor="description">Description</label>
          </FloatLabel>
          {!smallScreen && (
            <Button
              className="mt-5"
              label="Delete Project"
              icon="pi pi-trash"
              severity="danger"
            />
          )}
        </div>

        <div className="flex flex-column gap-3 justify-content-center">
          <div className="flex flex-row align-items-center justify-content-between mt-2">
            <h3 className="my-0">Deadline</h3>
            <Button
              size="small"
              label="Delete deadline"
              icon="pi pi-trash"
              severity="danger"
              disabled={!edit || editProject.deadline.value === undefined}
              onClick={() =>
                setEditProject({
                  ...editProject,
                  deadline: { value: undefined, error: false, edited: true },
                })
              }
            />
          </div>
          <Calendar
            value={editProject.deadline.value}
            minDate={new Date()}
            onChange={(e) => {
              setEditProject({
                ...editProject,
                deadline: {
                  value: e.value ? new Date(e.value) : new Date(),
                  error: false,
                  edited: true,
                },
              });
            }}
            inline
            disabled={!edit}
          />
          {/* <Calendar
            disabled={!edit}
            value={editProject.deadline.value}
            onChange={(e) => {
              setEditProject({
                ...editProject,
                deadline: {
                  value: e.value ? new Date(e.value) : new Date(),
                  error: false,
                },
              });
            }}
            timeOnly
            showIcon
            placeholder="Due time (default 23:59)"
            icon="pi pi-clock"
          /> */}
        </div>
        {smallScreen && (
          <Button
            className="mt-3"
            label="Delete Project"
            icon="pi pi-trash"
            severity="danger"
          />
        )}
      </div>
    </div>
  );
}
