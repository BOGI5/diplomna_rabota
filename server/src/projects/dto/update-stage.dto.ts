import { PartialType } from "@nestjs/mapped-types";
import { AddStageDto } from "./add-stage.dto";

export class UpdateStageDto extends PartialType(AddStageDto) {}
