import { CreateUserDto } from "./create-user.dto";
import { PartialType } from "@nestjs/mapped-types";
import { Member } from "src/members/entities/member.entity";
import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  picture?: string;

  @IsArray()
  @IsOptional()
  memberships?: Member[];
}
