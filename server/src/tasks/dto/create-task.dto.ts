import {
  IsDate,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { Project } from "src/projects/entities/project.entity";
import { Stage } from "src/stages/entities/stage.entity";

export class CreateTaskDto {
  @IsObject()
  @IsNotEmpty()
  project: Project;

  @IsObject()
  @IsNotEmpty()
  @IsOptional()
  stage: Stage;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  deadline?: Date;
}
