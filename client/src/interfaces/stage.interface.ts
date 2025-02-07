import Task from "./task.interface";

export default interface Stage {
  id: number;
  projectId: number;
  name: string;
  tasks: Task[];
}
