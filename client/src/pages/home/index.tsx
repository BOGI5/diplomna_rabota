import { Button } from "primereact/button";
import { Card } from "primereact/card";
import ApiService from "../../services/api";
import { useEffect, useState } from "react";
import CreateProjectModal from "../../components/CreateProjectModal";
import ProjectCard from "../../components/ProjectCard";
import Project from "../../interfaces/project.interface";
import Listing from "../../components/Listing";
import Task from "../../interfaces/task.interface";
import TaskCard from "../../components/project/kanban/task/TaskCard";

export default function Home() {
  const apiService = new ApiService();
  const [visible, setVisible] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    apiService.get("/me/projects").then((res) => {
      setProjects(res.data);
    });
    apiService.get("/me/tasks").then((res) => {
      setTasks(res.data);
    });
  }, []);

  return (
    <div
      className="mt-2 flex flex-row justify-content-between gap-2"
      style={{ height: "calc(100vh - 90px)" }}
    >
      <Card
        className="w-6"
        title={
          <div className="flex flex-row justify-content-between align-content-center">
            <h2 className="m-0">Your projects</h2>
            <CreateProjectModal visible={visible} setVisible={setVisible} />
            <Button
              label="Create new project"
              icon="pi pi-plus"
              onClick={() => setVisible(true)}
            />
          </div>
        }
      >
        {projects.length === 0 ? (
          <p>You're not a member of any project.</p>
        ) : (
          <Listing
            itemTemplate={ProjectCard}
            items={projects.map((project) => ({ project }))}
            width="100%"
            height="calc(100vh - 240px)"
          />
        )}
      </Card>
      <Card
        title={<h2 className="m-0">Your assigned tasks</h2>}
        className="w-6"
      >
        {tasks.length === 0 ? (
          <p>You've not assigned tasks.</p>
        ) : (
          <Listing
            itemTemplate={TaskCard}
            items={tasks}
            width="100%"
            height="calc(100vh - 240px)"
          />
        )}
      </Card>
    </div>
  );
}
