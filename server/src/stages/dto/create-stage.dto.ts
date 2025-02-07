import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateStageDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
