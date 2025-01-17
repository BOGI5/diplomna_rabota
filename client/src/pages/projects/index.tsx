import React, { useState, useEffect } from "react";
import ProjectCard from "../../components/ProjectCard";
import ApiService from "../../services/api";

interface Project {
  id: string;
  name: string;
  description: string;
}

export default function Projects() {
  const apiService = new ApiService();
  const [cards, setCards] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    apiService.get("/me/projects").then((res) => {
      const projectCards = res.data.map((project: Project) => (
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

  return <div className="mt-2 flex flex-column gap-2">{cards}</div>;
}
