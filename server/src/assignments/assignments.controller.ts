import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AssignmentsService } from "./assignments.service";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";

@Controller("assignments")
@UseGuards(AccessTokenGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.assignmentsService.findOne(+id);
  }
}
