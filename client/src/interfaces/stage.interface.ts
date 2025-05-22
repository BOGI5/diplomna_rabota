import Project from "./project.interface";
import Task from "./task.interface";

export default interface Stage {
  id: number;
  project: Project;
  name: string;
  tasks: Task[];
}
