import { IsNotEmpty, IsString } from "class-validator";

export class AddStageDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
