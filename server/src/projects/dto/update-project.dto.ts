import { PartialType } from "@nestjs/mapped-types";
import { CreateProjectDto } from "./create-project.dto";
import { IsOptional, IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  removeDeadline?: Boolean;
}
