import Project from "./project.interface";
import User from "./user.interface";

export default interface Member {
  id: number;
  user: User;
  project: Project;
  memberType: string;
}
