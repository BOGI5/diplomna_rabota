import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto
  ) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tasksService.remove(+id);
  }
}
