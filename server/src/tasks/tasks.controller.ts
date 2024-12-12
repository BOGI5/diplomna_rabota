import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get("me")
  findUserTasks(@Req() req) {
    return this.tasksService.findUserTasks(req.user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tasksService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto
  ) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tasksService.remove(+id);
  }
}
