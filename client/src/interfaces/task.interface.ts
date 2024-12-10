export default interface Task {
  id: number;
  stageId: number;
  name: string;
  description?: string;
  deadline?: Date;
}
