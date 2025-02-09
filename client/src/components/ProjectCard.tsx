import { Card } from "primereact/card";
import Project from "../interfaces/project.interface";
import { Button } from "primereact/button";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <>
      <Card
        className="border-solid border-2 border-0 my-2"
        header={
          <div className="flex flex-row justify-content-between align-items-center m-4 mb-0">
            <div>
              <h2>{project.name}</h2>
              <label>{project.description || "No description provided"}</label>
            </div>
            <div className="flex flex-column gap-2">
              <p className="m-0">Members: {project.members.length}</p>
              <p className="m-0">Stages: {project.stages.length}</p>
              <p className="m-0">Tasks: {project.tasks.length}</p>
            </div>
            <Button
              onClick={() => (window.location.href = `/projects/${project.id}`)}
              label="Open"
              severity="info"
              icon="pi pi-folder-open"
              text
            />
          </div>
        }
      />
    </>
  );
}
