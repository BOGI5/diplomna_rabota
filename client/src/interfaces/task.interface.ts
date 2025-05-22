import Member from "./member.interface";
import Project from "./project.interface";
import Stage from "./stage.interface";

export default interface Task {
  id: number;
  stage?: Stage;
  project: Project;
  name: string;
  description?: string;
  deadline?: Date;
  assignedMembers: Member[];
}
