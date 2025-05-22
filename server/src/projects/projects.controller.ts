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
import { TransferOwnershipDto } from "./dto/transfer-ownership.dto";
import { AddMemberDto } from "./dto/add-member.dto";
import { AddStageDto } from "./dto/add-stage.dto";
import { AddTaskDto } from "./dto/add-task.dto";
import { UpdateStageDto } from "./dto/update-stage.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UpdateStageOrderDto } from "./dto/update-stage-order.dto";
import { UpdateTaskOrderDto } from "./dto/update-task-order.dto";
import { UpdateTaskStageDto } from "./dto/update-task-stage.dto";

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

  @Post(":id/transfer-ownership")
  @Roles("Owner")
  transferOwnership(
    @Body(ValidationPipe) transferOwnershipDto: TransferOwnershipDto,
    @Req() req,
    @Param("id") id: string
  ) {
    return this.projectsService.transferOwnership(
      +id,
      req.user.id,
      transferOwnershipDto.newOwnerId
    );
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
    return this.projectsService.addMember(addMemberDto, +id);
  }

  @Patch(":id/members/:memberId/promote")
  @Roles("Admin", "Owner")
  promoteMember(@Param("id") id: string, @Param("memberId") memberId: string) {
    return this.projectsService.manageMemberType(+id, +memberId, true);
  }

  @Patch(":id/members/:memberId/demote")
  @Roles("Owner")
  demoteMember(@Param("id") id: string, @Param("memberId") memberId: string) {
    return this.projectsService.manageMemberType(+id, +memberId, false);
  }

  @Delete(":id/leave")
  leaveProject(@Req() req, @Param("id") id: string) {
    return this.projectsService.removeMember(+id, req.user.id, req.user.id);
  }

  @Delete(":id/members/:userId")
  @Roles("Admin", "Owner")
  removeMember(
    @Req() req,
    @Param("id") id: string,
    @Param("userId") userId: string
  ) {
    return this.projectsService.removeMember(+id, +userId, req.user.id);
  }

  @Post(":id/stages")
  @Roles("Admin", "Owner")
  addStage(
    @Param("id") id: string,
    @Body(ValidationPipe) addStageDto: AddStageDto
  ) {
    return this.projectsService.addStage(addStageDto, +id);
  }

  @Get(":id/stages")
  findStages(@Param("id") id: string) {
    return this.projectsService.findStages(+id);
  }

  @Patch(":id/stages/order")
  @Roles("Admin", "Owner")
  updateStageOrder(
    @Param("id") id: string,
    @Body(ValidationPipe) updateStageOrderDto: UpdateStageOrderDto
  ) {
    return this.projectsService.updateStageOrder(+id, updateStageOrderDto);
  }

  @Patch(":id/stages/:stageId")
  @Roles("Admin", "Owner")
  updateStage(
    @Param("id") id: string,
    @Param("stageId") stageId: string,
    @Body(ValidationPipe) updateStageDto: UpdateStageDto
  ) {
    return this.projectsService.updateStage(+id, +stageId, updateStageDto);
  }

  @Delete(":id/stages/:stageId")
  @Roles("Admin", "Owner")
  removeStage(@Param("id") id: string, @Param("stageId") stageId: string) {
    return this.projectsService.removeStage(+id, +stageId);
  }

  @Patch(":id/stages/:stageId/order")
  updateTaskOrder(
    @Param("id") id: string,
    @Param("stageId") stageId: string,
    @Body(ValidationPipe) updateTaskOrderDto: UpdateTaskOrderDto
  ) {
    return this.projectsService.updateTaskOrder(
      +id,
      +stageId,
      updateTaskOrderDto
    );
  }

  @Patch(":id/stages/unstaged/tasks/:taskId")
  @Roles("Admin", "Owner")
  stageTask(
    @Param("id") id: string,
    @Param("taskId") taskId: string,
    @Body(ValidationPipe) updateTaskStageDto: UpdateTaskStageDto
  ) {
    return this.projectsService.manageTaskStage(
      +id,
      +taskId,
      updateTaskStageDto.destinationStageId
    );
  }

  @Patch(":id/stages/:stageId/tasks/:taskId")
  @Roles("Admin", "Owner")
  updateTaskStage(
    @Param("id") id: string,
    @Param("stageId") stageId: string,
    @Param("taskId") taskId: string,
    @Body(ValidationPipe) updateTaskStageDto: UpdateTaskStageDto
  ) {
    return this.projectsService.updateTaskStage(
      +id,
      +stageId,
      +taskId,
      updateTaskStageDto.destinationStageId
    );
  }

  @Patch(":id/stages/:stageId/tasks/:taskId/unstage")
  unstageTask(@Param("id") id: string, @Param("taskId") taskId: string) {
    return this.projectsService.manageTaskStage(+id, +taskId, null);
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
    return this.projectsService.addTask(addTaskDto, +id);
  }

  @Patch(":id/tasks/:taskId")
  @Roles("Admin", "Owner")
  updateTask(
    @Param("id") id: string,
    @Param("taskId") taskId: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto
  ) {
    return this.projectsService.updateTask(+id, +taskId, updateTaskDto);
  }

  @Delete(":id/tasks/:taskId")
  @Roles("Admin", "Owner")
  removeTask(@Param("id") id: string, @Param("taskId") taskId: string) {
    return this.projectsService.removeTask(+id, +taskId);
  }

  @Post(":id/tasks/:taskId/assign")
  assignTask(
    @Param("id") id: string,
    @Param("taskId") taskId: string,
    @Req() req
  ) {
    return this.projectsService.manageAssignment(
      +id,
      +taskId,
      req.user.id,
      true
    );
  }

  @Delete(":id/tasks/:taskId/unassign")
  unassignTask(
    @Param("id") id: string,
    @Param("taskId") taskId: string,
    @Req() req
  ) {
    return this.projectsService.manageAssignment(
      +id,
      +taskId,
      req.user.id,
      false
    );
  }

  @Patch(":id")
  @Roles("Owner")
  update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateProjectDto: UpdateProjectDto
  ) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(":id")
  @Roles("Owner")
  remove(@Param("id") id: string) {
    return this.projectsService.remove(+id);
  }
}
