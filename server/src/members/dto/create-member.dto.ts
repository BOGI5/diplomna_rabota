import { IsIn, IsInt, IsNotEmpty, IsObject, IsString } from "class-validator";
import { Project } from "src/projects/entities/project.entity";

export class CreateMemberDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsObject()
  @IsNotEmpty()
  project: Project;

  @IsString()
  @IsIn(["Owner", "Admin", "User"])
  @IsNotEmpty()
  memberType: string;
}
