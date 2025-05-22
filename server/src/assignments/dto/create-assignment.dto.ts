import { Task } from "src/tasks/entities/task.entity";
import { Member } from "src/members/entities/member.entity";
import { IsNotEmpty, IsObject } from "class-validator";

export class CreateAssignmentDto {
  @IsObject()
  @IsNotEmpty()
  task: Task;

  @IsObject()
  @IsNotEmpty()
  member: Member;
}
