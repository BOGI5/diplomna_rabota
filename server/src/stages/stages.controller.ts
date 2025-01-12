import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { StagesService } from "./stages.service";
import { UpdateStageDto } from "./dto/update-stage.dto";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";

@Controller("stages")
@UseGuards(AccessTokenGuard)
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Get()
  async findAll() {
    return await this.stagesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.stagesService.findOne(+id);
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
