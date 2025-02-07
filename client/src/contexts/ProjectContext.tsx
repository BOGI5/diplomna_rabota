import React, { createContext, useContext, useState, ReactNode } from "react";
import Project from "../interfaces/project.interface";
import Member from "../interfaces/member.interface";
import User from "../interfaces/user.interface";
import ApiService from "../services/api";

interface ProjectContextType {
  project: Project | null;
  currentMember: Member | null;
  permissions: number;
  setProjectData: (project: Project, user: User) => void;
  updateProjectData: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [permissions, setPermissions] = useState<number>(0);
  const apiService = new ApiService();

  const setProjectData = (project: Project, user: User) => {
    project.members = sortMembers(project.members);
    setProject(project);

    const member = project.members.find((member) => member.userId === user.id);
    setCurrentMember(member || null);
    setPermissions(
      member?.memberType === "Owner"
        ? 2
        : member?.memberType === "Admin"
        ? 1
        : 0
    );
  };

  const sortMembers = (members: Member[]): Member[] => {
    const order = { Owner: 0, Admin: 1, User: 2 };
    return members.sort((a, b) => {
      return (
        order[a.memberType as keyof typeof order] -
        order[b.memberType as keyof typeof order]
      );
    });
  };

  const updateProjectData = async () => {
    await apiService.get(`/projects/${project?.id}`).then((res) => {
      const updatedProject = res.data;
      updatedProject.members = sortMembers(updatedProject.members);
      setProject(updatedProject);
    });
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        currentMember,
        permissions,
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
