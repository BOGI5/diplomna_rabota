import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import ApiService from "../services/api";

interface ProjectData {
  id: string;
  name: string;
  description?: string;
  members?: number;
}

export default function ProjectCard({ id, name, description }: ProjectData) {
  const apiService = new ApiService();
  const [projectData, setProjectData] = useState<ProjectData>({
    id: id,
    name: name,
    description: description,
    members: 0,
  });

  useEffect(() => {
    (async () => {
      const res = await apiService.get(`/projects/${id}`);
      setProjectData({ ...res.data, members: res.data.members.length });
    })();
  }, [id]);

  return (
    <>
      <Card
        onClick={() => (window.location.href = `/projects/${id}`)}
        className="border-solid border-2 border-0"
        header={
          <div className="flex flex-row justify-content-between m-4 mb-0">
            <div>
              <h2>{projectData.name}</h2>
              <label>
                {projectData.description || "No description provided"}
              </label>
            </div>
            <p className="align-self-center">Members: {projectData.members}</p>
            <div className="flex flex-column gap-2">
              <Button
                label="Settings"
                icon="pi pi-cog"
                size="small"
                severity="secondary"
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
