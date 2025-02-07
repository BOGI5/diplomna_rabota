export default interface Task {
  id: number;
  stageId: number;
  projectId: number;
  name: string;
  description?: string;
  deadline?: Date;
}
