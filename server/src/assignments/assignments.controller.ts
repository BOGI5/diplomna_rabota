import { Controller, Get, Param, Delete } from "@nestjs/common";
import { AssignmentsService } from "./assignments.service";

@Controller("assignments")
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

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.assignmentsService.remove(+id);
  }
}
