import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { Project } from "src/projects/entities/project.entity";

export class CreateStageDto {
  @IsObject()
  @IsNotEmpty()
  project: Project;

  @IsString()
  @IsNotEmpty()
  name: string;
}
