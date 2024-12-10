import React, { createContext, useContext, useState, ReactNode } from "react";
import Project from "../interfaces/project.interface";
import Member from "../interfaces/member.interface";
import User from "../interfaces/user.interface";

interface ProjectContextType {
  project: Project | null;
  currentMember: Member | null;
  isAdmin: boolean;
  setProjectData: (project: Project, user: User) => void;
  updateProjectData: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const setProjectData = (project: Project, user: User) => {
    setProject(project);

    const member = project.members.find((member) => member.userId === user.id);
    setCurrentMember(member || null);
    setIsAdmin(member?.memberType === "Admin");
  };

  const updateProjectData = (project: Project) => {
    setProject(project);
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        currentMember,
        isAdmin,
        setProjectData,
        updateProjectData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
