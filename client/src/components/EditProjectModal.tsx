import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import ApiService from "../services/api";

interface ProjectData {
  id: string;
  name: string;
  description?: string;
}

interface EditProjectModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  projectData: ProjectData;
}

export default function EditProjectModal(props: EditProjectModalProps) {
  const [projectData, setProjectData] = useState<ProjectData>(
    props.projectData
  );
  const apiService = new ApiService();
  return (
    <Dialog
      visible={props.visible}
      draggable={false}
      onHide={async () => {
        await apiService.get(`/projects/${projectData.id}`).then((res) => {
          setProjectData(res.data);
        });
        props.setVisible(false);
      }}
      header="Edit project"
    >
      <form className="mt-4 flex flex-column gap-5 justify-content-center">
        <FloatLabel>
          <InputText
            id="projectName"
            value={projectData.name}
            onChange={(e) =>
              setProjectData({ ...projectData, name: e.target.value })
            }
            required
          />
          <label htmlFor="projectName">Name</label>
        </FloatLabel>
        <FloatLabel>
          <InputText
            id="projectDescription"
            value={projectData.description}
            onChange={(e) =>
              setProjectData({ ...projectData, description: e.target.value })
            }
          />
          <label htmlFor="projectDescription">
            Description <i>(optional)</i>
          </label>
        </FloatLabel>
        <div className="flex flex-row justify-content-between">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={async () => props.setVisible(false)}
            text
            raised
          />
          <Button label="Save" icon="pi pi-check" type="submit" />
        </div>
      </form>
    </Dialog>
  );
}
