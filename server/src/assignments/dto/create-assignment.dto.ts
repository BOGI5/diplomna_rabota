import { IsInt, IsNotEmpty } from "class-validator";

export class CreateAssignmentDto {
  @IsInt()
  @IsNotEmpty()
  taskId: number;

  @IsInt()
  @IsNotEmpty()
  memberId: number;
}
