import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from "@nestjs/common";
import { StagesService } from "./stages.service";
import { UpdateStageDto } from "./dto/update-stage.dto";

@Controller("stages")
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Get()
  findAll() {
    return this.stagesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.stagesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateStageDto: UpdateStageDto
  ) {
    return this.stagesService.update(+id, updateStageDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.stagesService.remove(+id);
  }
}
