import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { StagesService } from "./stages.service";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";

@Controller("stages")
@UseGuards(AccessTokenGuard)
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
}
