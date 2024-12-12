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
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.stagesService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.stagesService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateStageDto: UpdateStageDto
  ) {
    return this.stagesService.update(+id, updateStageDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.stagesService.remove(+id);
  }
}
