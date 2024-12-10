import Member from "./member.interface";
import Stage from "./stage.interface";
import Task from "./task.interface";

export default interface Project {
  id: number;
  name: string;
  description?: string;
  members: Member[];
  stages: Stage[];
  tasks: Task[];
}
