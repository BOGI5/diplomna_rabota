import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useState } from "react";
import ApiService from "../services/api";

interface ProjectData {
  id: string;
  name: string;
  description?: string;
}

export default function ProjectCard(props: ProjectData) {
  const apiService = new ApiService();
  const [projectData, setProjectData] = useState<ProjectData>({
    id: props.id,
    name: props.name,
    description: props.description,
  });
  return (
    <>
      <Card
        onClick={async () => {
          await apiService.get(`/projects/${props.id}`).then((res) => {
            setProjectData(res.data);
            window.location.href = `/projects/${props.id}`;
          });
        }}
        className="border-solid border-2 border-0"
        header={
          <div className="flex flex-row justify-content-between m-4 mb-0">
            <div>
              <h2>{projectData.name}</h2>
              <label>
                {projectData.description || "No description provided"}
              </label>
            </div>
            <p className="align-self-center">Members: 45</p>
            <div className="flex flex-column gap-2">
              <Button
                label="Settings"
                icon="pi pi-cog"
                size="small"
                severity="secondary"
                onClick={async () => {
                  await apiService.get(`/projects/${props.id}`).then((res) => {
                    setProjectData(res.data);
                  });
                }}
                outlined
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                severity="danger"
                size="small"
                outlined
              />
            </div>
          </div>
        }
      />
    </>
  );
}
