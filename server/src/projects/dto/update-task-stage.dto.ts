import { IsInt } from "class-validator";

export class UpdateTaskStageDto {
  @IsInt()
  destinationStageId: number;
}
