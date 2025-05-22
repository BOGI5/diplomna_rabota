import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { Project } from "src/projects/entities/project.entity";

export class CreateTaskDto {
  @IsObject()
  @IsNotEmpty()
  project: Project;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  stageId: number;

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
