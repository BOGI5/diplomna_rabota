import { Controller, Get, Param, Delete, UseGuards } from "@nestjs/common";
import { AssignmentsService } from "./assignments.service";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";

@Controller("assignments")
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.assignmentsService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.assignmentsService.remove(+id);
  }
}
