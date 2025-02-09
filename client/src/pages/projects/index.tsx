import { useState, useEffect } from "react";
import ProjectCard from "../../components/ProjectCard";
import ApiService from "../../services/api";
import Project from "../../interfaces/project.interface";
import Listing from "../../components/Listing";

export default function Projects() {
  const apiService = new ApiService();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    apiService.get("/me/projects").then((res) => {
      setProjects(res.data);
    });
  }, []);

  return (
    <Listing
      itemTemplate={ProjectCard}
      items={projects.map((project) => ({ project }))}
      width="100%"
      height="calc(100vh - 100px)"
    />
  );
}
