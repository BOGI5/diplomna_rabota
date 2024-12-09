import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Req,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
// import { UpdateProjectDto } from "./dto/update-project.dto";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";
import { AddMemberDto } from "./dto/add-member.dto";
import { AddStageDto } from "./dto/add-stage.dto";
import { AddTaskDto } from "./dto/add-task.dto";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Req() req, @Body(ValidationPipe) createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get("me")
  async findUserProjects(@Req() req) {
    return await this.projectsService.findUserProjects(req.user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id/members")
  findMembers(@Param("id") id: string) {
    return this.projectsService.findMembers(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Post(":id/members")
  addMember(
    @Param("id") id: string,
    @Body(ValidationPipe) addMemberDto: AddMemberDto
  ) {
    return this.projectsService.addMember({
      ...addMemberDto,
      projectId: +id,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id/stages")
  findStages(@Param("id") id: string) {
    return this.projectsService.findStages(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Post(":id/stages")
  addStage(
    @Param("id") id: string,
    @Body(ValidationPipe) addStageDto: AddStageDto
  ) {
    return this.projectsService.addStage({
      ...addStageDto,
      projectId: +id,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id/tasks")
  findTasks(@Param("id") id: string) {
    return this.projectsService.findTasks(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Post(":id/tasks")
  addTask(
    @Param("id") id: string,
    @Body(ValidationPipe) addTaskDto: AddTaskDto
  ) {
    return this.projectsService.addTask({
      ...addTaskDto,
      projectId: +id,
    });
  }

  // @UseGuards(AccessTokenGuard)
  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto) {
  //   return this.projectsService.update(+id, updateProjectDto);
  // }

  @UseGuards(AccessTokenGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectsService.remove(+id);
  }
}
