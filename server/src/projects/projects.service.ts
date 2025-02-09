import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { MembersService } from "src/members/members.service";
import { StagesService } from "src/stages/stages.service";
import { TasksService } from "src/tasks/tasks.service";
import { Project } from "./entities/project.entity";
import { CreateMemberDto } from "src/members/dto/create-member.dto";
import { CreateStageDto } from "src/stages/dto/create-stage.dto";
import { CreateTaskDto } from "src/tasks/dto/create-task.dto";
import { UpdateStageDto } from "./dto/update-stage.dto";
import { UpdateStageOrderDto } from "./dto/update-stage-order.dto";
import { UpdateTaskOrderDto } from "./dto/update-task-order.dto";
import { AssignmentsService } from "src/assignments/assignments.service";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private assignmentsService: AssignmentsService,
    private membersService: MembersService,
    private stagesService: StagesService,
    private tasksService: TasksService
  ) {}

  public async create(createProjectDto: CreateProjectDto, ownerId: number) {
    const project = await this.projectRepository.save({
      ...createProjectDto,
      stages: [],
    });
    await this.membersService.create({
      userId: ownerId,
      projectId: project.id,
      memberType: "Owner",
    });
    return project;
  }

  public async addMember(createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  public async addStage(createStageDto: CreateStageDto) {
    const project = await this.projectRepository.findOne({
      where: { id: createStageDto.projectId },
    });
    const stage = await this.stagesService.create(createStageDto);
    project.stages.push(stage.id);
    await this.projectRepository.update(project.id, { stages: project.stages });
    return stage;
  }

  public async addTask(createTaskDto: CreateTaskDto) {
    const stage = await this.stagesService.findOne(createTaskDto.stageId);
    if (stage.projectId !== createTaskDto.projectId) {
      throw new BadRequestException("Stage is not part of this project");
    }
    const task = await this.tasksService.create(createTaskDto);
    await this.stagesService.addTask(stage.id, task.id);
    return task;
  }

  public async assignTask(projectId: number, taskId: number, userId: number) {
    const task = await this.tasksService.findOne(taskId);
    const member = await this.membersService.findMember(userId, projectId);
    if (!member) {
      throw new ForbiddenException("User is not part of this project");
    }
    if (task.projectId !== projectId) {
      throw new BadRequestException("Task is not part of this project");
    }
    if (await this.assignmentsService.findAssignment(member.id, taskId)) {
      throw new BadRequestException("Task is already assigned to this user");
    }
    return this.assignmentsService.create({ taskId, memberId: member.id });
  }

  public async unassignTask(projectId: number, taskId: number, userId: number) {
    const task = await this.tasksService.findOne(taskId);
    const member = await this.membersService.findMember(userId, projectId);
    if (!member) {
      throw new ForbiddenException("User is not part of this project");
    }
    if (task.projectId !== projectId) {
      throw new BadRequestException("Task is not part of this project");
    }
    const assignment = await this.assignmentsService.findAssignment(
      member.id,
      taskId
    );
    if (!assignment) {
      throw new BadRequestException("Task is not assigned to this user");
    }
    return this.assignmentsService.remove(assignment.id);
  }

  public async findAll() {
    const projects = await this.projectRepository.find();
    return Promise.all(
      projects.map(async (project) => {
        return await this.formatProject(project);
      })
    );
  }

  public async findOne(id: number) {
    const project = await this.projectRepository.findOne({ where: { id } });
    return await this.formatProject(project);
  }

  public findMembers(id: number) {
    return this.membersService.findByProjectId(id);
  }

  public async findStages(id: number) {
    const project = await this.projectRepository.findOne({ where: { id } });
    return await Promise.all(
      project.stages.map(async (stageId: number) => {
        return await this.stagesService.findOne(stageId);
      })
    );
  }

  public async findTasks(id: number) {
    return await this.tasksService.findByProjectId(id);
  }

  public async transferOwnership(
    id: number,
    ownerId: number,
    newOwnerId: number
  ) {
    const owner = await this.membersService.findMember(ownerId, id);
    const newOwner = await this.membersService.findOne(newOwnerId);
    if (newOwner.projectId !== id) {
      throw new BadRequestException("New owner is not part of this project");
    }
    await this.membersService.update(newOwner.id, { memberType: "Owner" });
    await this.membersService.update(owner.id, { memberType: "Admin" });
  }

  public update(id: number, updateProjectDto: UpdateProjectDto) {
    if (Object.keys(updateProjectDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    if (updateProjectDto.removeDeadline) {
      updateProjectDto.deadline = null;
    }
    delete updateProjectDto.removeDeadline;
    return this.projectRepository.update(id, updateProjectDto);
  }

  public async updateStage(
    projectId: number,
    stageId: number,
    updateStageDto: UpdateStageDto
  ) {
    const stage = await this.stagesService.findOne(stageId);
    if (stage.projectId !== projectId) {
      throw new BadRequestException("Stage is not part of this project");
    }
    return this.stagesService.update(stageId, updateStageDto);
  }

  public async updateStageOrder(
    projectId: number,
    updateStageOrderDto: UpdateStageOrderDto
  ) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    for (const stageId of updateStageOrderDto.stageOrder) {
      if (!project.stages.includes(stageId)) {
        throw new BadRequestException("Stage is not part of this project");
      }
    }
    for (const stageId of project.stages) {
      if (!updateStageOrderDto.stageOrder.includes(Number(stageId))) {
        throw new BadRequestException("All stages must be included");
      }
    }
    if (
      new Set(updateStageOrderDto.stageOrder).size !==
      updateStageOrderDto.stageOrder.length
    ) {
      throw new BadRequestException("Duplicate stages not allowed");
    }
    return this.projectRepository.update(projectId, {
      stages: updateStageOrderDto.stageOrder,
    });
  }

  public async updateTaskOrder(
    projectId: number,
    stageId: number,
    updateTaskOrderDto: UpdateTaskOrderDto
  ) {
    const stage = await this.stagesService.findOne(stageId);
    if (stage.projectId !== projectId) {
      throw new BadRequestException("Stage is not part of this project");
    }
    return this.stagesService.updateTaskOrder(stageId, updateTaskOrderDto);
  }

  public async updateTask(
    projectId: number,
    taskId: number,
    updateTaskDto: any
  ) {
    const task = await this.tasksService.findOne(taskId);
    if (task.projectId !== projectId) {
      throw new BadRequestException("Task is not part of this project");
    }
    return this.tasksService.update(taskId, updateTaskDto);
  }

  public async updateTaskStage(
    projectId: number,
    stageId: number,
    taskId: number,
    destinationStageId: number
  ) {
    const task = await this.tasksService.findOne(taskId);
    if (task.projectId !== projectId) {
      throw new BadRequestException("Task is not part of this project");
    }
    const sourceStage = await this.stagesService.findOne(stageId);
    const destinationStage =
      await this.stagesService.findOne(destinationStageId);
    if (sourceStage.projectId !== projectId) {
      throw new BadRequestException("Source stage is not part of this project");
    }
    if (destinationStage.projectId !== projectId) {
      throw new BadRequestException(
        "Destination stage is not part of this project"
      );
    }
    await this.stagesService.removeTask(sourceStage.id, taskId);
    return this.stagesService.addTask(destinationStage.id, taskId);
  }

  public async stageTask(projectId: number, taskId: number, stageId: number) {
    const task = await this.tasksService.findOne(taskId);
    if (task.projectId !== projectId) {
      throw new BadRequestException("Task is not part of this project");
    }
    const stage = await this.stagesService.findOne(stageId);
    if (stage.projectId !== projectId) {
      throw new BadRequestException("Stage is not part of this project");
    }
    return this.stagesService.addTask(stage.id, taskId);
  }

  public async unstageTask(projectId: number, taskId: number) {
    const task = await this.tasksService.findOne(taskId);
    if (task.projectId !== projectId) {
      throw new BadRequestException("Task is not part of this project");
    }
    return this.stagesService.removeTask(task.stageId, taskId);
  }

  public async promoteMember(projectId: number, memberId: number) {
    const member = await this.membersService.findOne(memberId);
    if (member.projectId !== projectId) {
      throw new BadRequestException("Member is not part of this project");
    }
    if (member.memberType === "Owner" || member.memberType === "Admin") {
      throw new BadRequestException("Can't promote owner or admin");
    }
    return this.membersService.update(memberId, { memberType: "Admin" });
  }

  public async demoteMember(projectId: number, memberId: number) {
    const member = await this.membersService.findOne(memberId);
    if (member.projectId !== projectId) {
      throw new BadRequestException("Member is not part of this project");
    }
    if (member.memberType === "Owner" || member.memberType === "User") {
      throw new BadRequestException("Can't demote owner or user");
    }
    return this.membersService.update(memberId, { memberType: "User" });
  }

  public async leaveProject(userId: number, projectId: number) {
    const member = await this.membersService.findMember(userId, projectId);
    if (member.memberType === "Owner") {
      throw new BadRequestException(
        "Can't leave project as owner. Please transfer ownership first."
      );
    }
    return this.membersService.remove(member.id);
  }

  public async removeMember(
    projectId: number,
    memberId: number,
    issuerId: number
  ) {
    const member = await this.membersService.findOne(memberId);
    const issuer = await this.membersService.findMember(issuerId, projectId);
    if (member.projectId !== projectId) {
      throw new ForbiddenException("Member is not part of this project");
    }

    if (issuer.memberType === "Admin" && member.memberType === "Admin") {
      throw new ForbiddenException("Admins can't remove other admins");
    }

    if (member.memberType === "Owner") {
      throw new ForbiddenException("Can't remove owner");
    }

    return this.membersService.remove(memberId);
  }

  public async removeStage(projectId: number, stageId: number) {
    const stage = await this.stagesService.findOne(stageId);
    if (stage.projectId !== projectId) {
      throw new BadRequestException("Stage is not part of this project");
    }
    if (stage.tasks.length > 0) {
      throw new BadRequestException(
        "Stage has tasks. Please remove them first"
      );
    }
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    project.stages = project.stages.filter((id) => id !== stageId);
    await this.projectRepository.update(projectId, { stages: project.stages });
    return this.stagesService.remove(stageId);
  }

  public async removeTask(projectId: number, taskId: number) {
    const task = await this.tasksService.findOne(taskId);
    if (task.projectId !== projectId) {
      throw new BadRequestException("Task is not part of this project");
    }
    await this.stagesService.removeTask(task.stageId, task.id);
    return this.tasksService.remove(taskId);
  }

  public async remove(id: number) {
    const members = await this.membersService.findByProjectId(id);
    const stages = await this.stagesService.findByProjectId(id);
    const tasks = await this.tasksService.findByProjectId(id);
    for (const task of tasks) {
      await this.tasksService.remove(task.id);
    }
    for (const stage of stages) {
      await this.stagesService.remove(stage.id);
    }
    for (const member of members) {
      await this.membersService.remove(member.id);
    }
    return this.projectRepository.delete(id);
  }

  private async formatProject(project: Project) {
    const stages = await Promise.all(
      project.stages.map(async (stageId: number) => {
        return await this.stagesService.findOne(stageId);
      })
    );
    delete project.stages;
    return {
      ...project,
      stages,
      members: await this.findMembers(project.id),
      tasks: await this.findTasks(project.id),
      unstagedTasks: (await this.findTasks(project.id)).filter((task) => {
        return task.stageId === null;
      }),
    };
  }
}
