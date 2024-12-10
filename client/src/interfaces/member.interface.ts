import User from "./user.interface";

export default interface Member {
  userId: number;
  user: User;
  projectId: number;
  memberType: string;
}
