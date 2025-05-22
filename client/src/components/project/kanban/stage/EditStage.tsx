import { Dialog } from "primereact/dialog";
import Stage from "../../../../interfaces/stage.interface";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import ApiService from "../../../../services/api";
import { FloatLabel } from "primereact/floatlabel";
import { ButtonGroup } from "primereact/buttongroup";
import { Button } from "primereact/button";
import { useProjectContext } from "../../../../contexts/ProjectContext";

export default function EditStage({
  stage,
  visible,
  setVisible,
}: {
  stage: Stage;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const apiService = new ApiService();
  const { updateProjectData } = useProjectContext();
  const [name, setName] = useState(stage.name);
  const [smallScreen, setSmallScreen] = useState(window.innerWidth < 400);
  onresize = () => {
    setSmallScreen(window.innerWidth < 400);
  };

  return (
    <Dialog
      header="Edit Stage"
      draggable={false}
      visible={visible}
      onHide={() => {
        setVisible(false);
      }}
    >
      <div className="pt-4 flex flex-column gap-3 align-items-center">
        <FloatLabel>
          <label htmlFor="name">Stage Name</label>
          <InputText
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            invalid={!name}
          />
        </FloatLabel>
        <ButtonGroup>
          <Button
            label={`${smallScreen ? "" : "Cancel"}`}
            severity="danger"
            text
            rounded
            icon="pi pi-times"
            onClick={() => setVisible(false)}
          />
          <Button
            label={`${smallScreen ? "" : "Save"}`}
            severity="success"
            text
            rounded
            icon="pi pi-save"
            onClick={async () => {
              if (!name) {
                return;
              }
              await apiService
                .patch(`/projects/${stage?.project.id}/stages/${stage?.id}`, {
                  name,
                })
                .then(() => {
                  updateProjectData();
                  setVisible(false);
                });
            }}
          />
          <Button
            label={`${smallScreen ? "" : "Delete"}`}
            severity="danger"
            text
            rounded
            icon="pi pi-trash"
            onClick={async () => {
              await apiService
                .delete(`/projects/${stage?.project.id}/stages/${stage?.id}`)
                .then(() => {
                  updateProjectData();
                  setVisible(false);
                });
            }}
          />
        </ButtonGroup>
      </div>
    </Dialog>
  );
}
