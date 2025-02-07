import { useState } from "react";
import ApiService from "../../../../services/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { ButtonGroup } from "primereact/buttongroup";
import { useProjectContext } from "../../../../contexts/ProjectContext";

export default function AddStage() {
  const { project, updateProjectData } = useProjectContext();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const apiService = new ApiService();

  return (
    <>
      <Button
        className="align-self-center"
        icon="pi pi-plus"
        rounded
        outlined
        severity="secondary"
        size="large"
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="Create Stage"
        draggable={false}
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <form
          className="flex flex-column gap-4 pt-4 align-items-center"
          onReset={() => {
            setName("");
            setVisible(false);
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            await apiService
              .post(`/projects/${project?.id}/stages`, { name: name })
              .then(() => updateProjectData());
            setName("");
            setVisible(false);
          }}
        >
          <FloatLabel>
            <InputText
              id="name"
              name="name"
              size={27}
              value={name}
              onChange={(e) => setName(e.target.value)}
              invalid={name.length === 0}
              required
              max={27}
            />
            <label htmlFor="name">Stage name</label>
          </FloatLabel>
          <ButtonGroup>
            <Button
              severity="danger"
              text
              rounded
              icon="pi pi-times"
              label="Cancel"
              type="reset"
            />
            <Button
              severity="success"
              text
              rounded
              icon="pi pi-check"
              iconPos="right"
              label="Create"
              type="submit"
            />
          </ButtonGroup>
        </form>
      </Dialog>
    </>
  );
}
