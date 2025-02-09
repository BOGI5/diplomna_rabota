import Member from "./member.interface";

export default interface Task {
  id: number;
  stageId: number;
  projectId: number;
  name: string;
  description?: string;
  deadline?: Date;
  assignedMembers: Member[];
}
