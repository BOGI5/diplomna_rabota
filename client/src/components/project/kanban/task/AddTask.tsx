import { useState } from "react";
import ApiService from "../../../../services/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { ButtonGroup } from "primereact/buttongroup";
import { InputTextarea } from "primereact/inputtextarea";
import { useProjectContext } from "../../../../contexts/ProjectContext";

export default function AddTask({ stageId }: { stageId: number | undefined }) {
  const apiService = new ApiService();
  const { project, updateProjectData } = useProjectContext();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        size="small"
        label="Create Task"
        icon="pi pi-plus"
        severity="secondary"
        outlined
        rounded
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="Create Task"
        draggable={false}
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <form
          className="flex flex-column gap-4 pt-4 align-items-center"
          onReset={() => {
            setName("");
            setDescription("");
            setVisible(false);
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            await apiService.post(`/projects/${project?.id}/tasks`, {
              stageId,
              name,
              description,
            });
            updateProjectData();
            setDescription("");
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
            <label htmlFor="name">Task name</label>
          </FloatLabel>
          <FloatLabel>
            <InputTextarea
              id="description"
              name="description"
              rows={5}
              cols={30}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label htmlFor="description">
              Task description <i>(optional)</i>
            </label>
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
