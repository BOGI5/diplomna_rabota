import { Dialog } from "primereact/dialog";
import { useProjectContext } from "../../../../contexts/ProjectContext";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import ApiService from "../../../../services/api";
import Task from "../../../../interfaces/task.interface";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";
import { Calendar } from "primereact/calendar";

export default function EditTask({
  task,
  visible,
  setVisible,
}: {
  task: Task;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const { updateProjectData, permissions, currentMember } = useProjectContext();
  const apiService = new ApiService();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);

  let taskAssigned =
    currentMember &&
    Array.isArray(task.assignedMembers) &&
    task.assignedMembers.includes(currentMember);

  return (
    <Dialog
      header="Edit Task"
      draggable={false}
      visible={visible}
      onHide={() => {
        setVisible(false);
      }}
    >
      <div className="flex flex-column gap-4 align-items-center pt-4">
        <FloatLabel>
          <InputText
            id="name"
            name="name"
            size={27}
            value={name}
            onChange={(e) => setName(e.target.value)}
            invalid={name.length === 0}
            required
            disabled={!edit}
            max={27}
          />
          <label htmlFor="name">Task name</label>
        </FloatLabel>
        <FloatLabel>
          <InputTextarea
            id="description"
            name="description"
            rows={5}
            cols={30}
            value={description}
            disabled={!edit}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="description">
            Task description <i>(optional)</i>
          </label>
        </FloatLabel>
        <FloatLabel className="w-full">
          <label htmlFor="deadline">
            Deadline <i>(optional)</i>
          </label>

          <Calendar id="deadline" className="w-full" disabled={!edit} />
        </FloatLabel>
        <div className="flex flex-column gap-2">
          <Button
            text
            label={taskAssigned ? "Unassign task" : "Assign task"}
            icon="pi pi-clipboard"
            severity="info"
            onClick={async () => {
              if (taskAssigned) {
                await apiService
                  .delete(
                    `/projects/${task.project.id}/tasks/${task.id}/unassign`
                  )
                  .then(() => {
                    updateProjectData();
                    taskAssigned = false;
                  });
              } else {
                await apiService
                  .post(`/projects/${task.project.id}/tasks/${task.id}/assign`)
                  .then(() => {
                    updateProjectData();
                    taskAssigned = true;
                  });
              }
            }}
          />
          {permissions > 0 && (
            <ButtonGroup>
              {edit && (
                <Button
                  text
                  icon="pi pi-times"
                  severity="danger"
                  label="Cancel"
                  onClick={() => {
                    setEdit(false);
                    setName(task.name);
                    setDescription(task.description);
                  }}
                />
              )}
              <Button
                text
                icon={`pi pi-${edit ? "save" : "pencil"}`}
                label={edit ? "Save" : "Edit"}
                severity={edit ? "success" : "warning"}
                onClick={async () => {
                  if (edit) {
                    if (name.length === 0) return;
                    await apiService
                      .patch(
                        `/projects/${task?.project.id}/tasks/${task?.id}`,
                        {
                          name,
                          description,
                        }
                      )
                      .then(() => {
                        updateProjectData();
                      });
                  }
                  setEdit(!edit);
                }}
              />
              <Button
                label="Delete"
                severity="danger"
                icon="pi pi-trash"
                iconPos="right"
                text
                onClick={async () => {
                  await apiService.delete(
                    `/projects/${task?.project.id}/tasks/${task?.id}`
                  );
                  updateProjectData();
                }}
              />
            </ButtonGroup>
          )}
        </div>
      </div>
    </Dialog>
  );
}
