import { Button } from "primereact/button";
import { Card } from "primereact/card";
import ApiService from "../../services/api";
import { useEffect, useState } from "react";
import CreateProjectModal from "../../components/CreateProjectModal";
import ProjectCard from "../../components/ProjectCard";

interface Project {
  id: string;
  name: string;
  description: string;
}

export default function Home() {
  const apiService = new ApiService();
  const [visible, setVisible] = useState<boolean>(false);
  const [cards, setCards] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    apiService.get("/me/projects").then((res) => {
      const projectCards = res.data
        .slice(0, 2)
        .map((project: Project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            description={project.description}
          />
        ));
      setCards(projectCards);
    });
  }, []);

  return (
    <>
      <div className="mt-2 flex flex-column gap-2">
        <div className="flex flex-row justify-content-between gap-2">
          <Card
            title={
              <div className="flex flex-row justify-content-between align-content-center">
                <h3 className="m-0">Your projects</h3>
                <CreateProjectModal visible={visible} setVisible={setVisible} />
                <Button
                  label="Create new project"
                  icon="pi pi-plus"
                  onClick={() => setVisible(true)}
                />
              </div>
            }
            className="w-6"
          >
            <div className="mt-3 flex flex-column gap-3">{cards}</div>
          </Card>
          <Card
            title="Your tasks"
            subTitle="Welcome to the Home page"
            className="w-6"
          />
        </div>
        <Card title="Your stats" subTitle="Welcome to the Home page" />
      </div>
    </>
  );
}
