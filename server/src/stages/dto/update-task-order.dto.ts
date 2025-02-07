import { IsArray, IsNumber } from "class-validator";

export class UpdateTaskOrderDto {
  @IsArray()
  @IsNumber({}, { each: true })
  taskOrder: number[];
}
