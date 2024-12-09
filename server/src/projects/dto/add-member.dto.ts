import { IsIn, IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddMemberDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsIn(["Admin", "User"])
  @IsNotEmpty()
  memberType: string;
}
