import { IsArray, IsNumber } from "class-validator";

export class UpdateStageOrderDto {
  @IsArray()
  @IsNumber({}, { each: true })
  stageOrder: number[];
}
