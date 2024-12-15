import User from "./user.interface";

export default interface Member {
  id: number;
  userId: number;
  user: User;
  projectId: number;
  memberType: string;
}
