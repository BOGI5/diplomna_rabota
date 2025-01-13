import { IsIn, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateMemberDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsString()
  @IsIn(["Owner", "Admin", "User"])
  @IsNotEmpty()
  memberType: string;
}
