import { PartialType } from "@nestjs/mapped-types";
import { CreateProjectDto } from "./create-project.dto";
import { IsArray, IsOptional } from "class-validator";
import { CreateMemberDto } from "src/members/dto/create-member.dto";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsOptional()
  @IsArray({ each: true })
  members: CreateMemberDto[];
}
