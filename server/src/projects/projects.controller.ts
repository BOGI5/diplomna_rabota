import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import ProjectGuard from "./guards/project.guard";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Roles } from "./decorators/roles.decorator";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";
import { AddMemberDto } from "./dto/add-member.dto";
import { AddStageDto } from "./dto/add-stage.dto";
import { AddTaskDto } from "./dto/add-task.dto";

@Controller("projects")
@UseGuards(AccessTokenGuard, ProjectGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() req, @Body(ValidationPipe) createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(+id);
  }

  @Get(":id/members")
  findMembers(@Param("id") id: string) {
    return this.projectsService.findMembers(+id);
  }

  @Post(":id/members")
  @Roles("Admin", "Owner")
  addMember(
    @Param("id") id: string,
    @Body(ValidationPipe) addMemberDto: AddMemberDto
  ) {
    return this.projectsService.addMember({
      ...addMemberDto,
      projectId: +id,
    });
  }

  @Patch(":id/members/:memberId/promote")
  @Roles("Admin", "Owner")
  promoteMember(@Param("id") id: string, @Param("memberId") memberId: string) {
    return this.projectsService.promoteMember(+id, +memberId);
  }

  @Patch(":id/members/:memberId/demote")
  @Roles("Owner")
  demoteMember(@Param("id") id: string, @Param("memberId") memberId: string) {
    return this.projectsService.demoteMember(+id, +memberId);
  }

  @Delete(":id/leave")
  leaveProject(@Req() req, @Param("id") id: string) {
    return this.projectsService.leaveProject(req.user.id, +id);
  }

  @Delete(":id/members/:memberId")
  @Roles("Admin", "Owner")
  removeMember(
    @Req() req,
    @Param("id") id: string,
    @Param("memberId") memberId: string
  ) {
    return this.projectsService.removeMember(+id, +memberId, req.user.id);
  }

  @Get(":id/stages")
  findStages(@Param("id") id: string) {
    return this.projectsService.findStages(+id);
  }

  @Post(":id/stages")
  @Roles("Admin", "Owner")
  addStage(
    @Param("id") id: string,
    @Body(ValidationPipe) addStageDto: AddStageDto
  ) {
    return this.projectsService.addStage({
      ...addStageDto,
      projectId: +id,
    });
  }

  @Get(":id/tasks")
  findTasks(@Param("id") id: string) {
    return this.projectsService.findTasks(+id);
  }

  @Post(":id/tasks")
  @Roles("Admin", "Owner")
  addTask(
    @Param("id") id: string,
    @Body(ValidationPipe) addTaskDto: AddTaskDto
  ) {
    return this.projectsService.addTask({
      ...addTaskDto,
      projectId: +id,
    });
  }

  @Patch(":id")
  @Roles("Owner")
  update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(":id")
  @Roles("Owner")
  remove(@Param("id") id: string) {
    return this.projectsService.remove(+id);
  }
}
