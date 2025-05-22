import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "./entities/project.entity";
import { TasksService } from "src/tasks/tasks.service";
import { StagesService } from "src/stages/stages.service";
import { MembersService } from "src/members/members.service";
import { AssignmentsService } from "src/assignments/assignments.service";
import { UpdateStageOrderDto } from "./dto/update-stage-order.dto";
import { UpdateTaskOrderDto } from "./dto/update-task-order.dto";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { UpdateStageDto } from "./dto/update-stage.dto";
import { AddMemberDto } from "./dto/add-member.dto";
import { AddStageDto } from "./dto/add-stage.dto";
import { AddTaskDto } from "./dto/add-task.dto";

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
      stagesOrder: [],
    });
    await this.membersService.create({
      userId: ownerId,
      project: project,
      memberType: "Owner",
    });
    return this.findOne(project.id);
  }

  public async addMember(addMemberDto: AddMemberDto, projectId: number) {
    const project = await this.findOne(projectId);
    return this.membersService.create({
      ...addMemberDto,
      project: project,
    });
  }

  public async addStage(addStageDto: AddStageDto, projectId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    const stage = await this.stagesService.create({ ...addStageDto, project });
    project.stagesOrder.push(stage.id);
    await this.projectRepository.update(project.id, {
      stagesOrder: project.stagesOrder,
    });
    return stage;
  }

  public async addTask(addTaskDto: AddTaskDto, projectId: number) {
    const project = await this.findOne(projectId);
    if (!addTaskDto.stageId) {
      const task = await this.tasksService.create({
        ...addTaskDto,
        project,
        stage: null,
      });
      return task;
    }
    const stage = project.stages.find(
      (stage) => stage.id === addTaskDto.stageId
    );
    if (!stage) {
      throw new BadRequestException("Stage is not part of this project");
    }
    const task = await this.tasksService.create({
      ...addTaskDto,
      project,
      stage,
    });
    await this.stagesService.addTask(stage, task);
    return task;
  }

  public async manageAssignment(
    projectId: number,
    taskId: number,
    userId: number,
    assign: boolean
  ) {
    const project = await this.findOne(projectId);
    const task = project.tasks.find((task) => task.id === taskId);
    const member = project.members.find((member) => member.user.id === userId);
    const assignment = task.assignments.find(
      (assignment) => assignment.member.id === member.id
    );
    if (!member) {
      throw new ForbiddenException("User is not part of this project");
    }
    if (!task) {
      throw new BadRequestException("Task is not part of this project");
    }
    if (assign && !assignment) {
      return this.assignmentsService.create({ task, member });
    } else if (!assign && assignment) {
      return this.assignmentsService.remove(assignment.id);
    } else {
      throw new BadRequestException(
        `Task is ${assignment ? "already" : "is not"} assigned to this user`
      );
    }
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

  public async findByUserId(userId: number) {
    const projects = await this.projectRepository.find({
      where: { members: { user: { id: userId } } },
    });
    return await Promise.all(
      projects.map(async (project) => {
        return await this.formatProject(project);
      })
    );
  }

  public findMembers(id: number) {
    return this.membersService.findByProjectId(id);
  }

  public async findStages(id: number) {
    const project = await this.projectRepository.findOne({ where: { id } });
    return await Promise.all(
      project.stagesOrder.map(async (stageId: number) => {
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
    if (newOwner.project.id !== id) {
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
    if (stage.project.id !== projectId) {
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
      if (!project.stagesOrder.includes(stageId)) {
        throw new BadRequestException("Stage is not part of this project");
      }
    }
    for (const stageId of project.stagesOrder) {
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
      stagesOrder: updateStageOrderDto.stageOrder,
    });
  }

  public async updateTaskOrder(
    projectId: number,
    stageId: number,
    updateTaskOrderDto: UpdateTaskOrderDto
  ) {
    const stage = await this.stagesService.findOne(stageId);
    if (stage.project.id !== projectId) {
      throw new BadRequestException("Stage is not part of this project");
    }
    return this.stagesService.updateTaskOrder(stage, updateTaskOrderDto);
  }

  public async updateTask(
    projectId: number,
    taskId: number,
    updateTaskDto: any
  ) {
    const task = await this.tasksService.findOne(taskId);
    if (task.project.id !== projectId) {
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
    if (task.project.id !== projectId) {
      throw new BadRequestException("Task is not part of this project");
    }
    const sourceStage = await this.stagesService.findOne(stageId);
    const destinationStage =
      await this.stagesService.findOne(destinationStageId);
    if (sourceStage.project.id !== projectId) {
      throw new BadRequestException("Source stage is not part of this project");
    }
    if (destinationStage.project.id !== projectId) {
      throw new BadRequestException(
        "Destination stage is not part of this project"
      );
    }
    await this.stagesService.removeTask(sourceStage, task);
    return this.stagesService.addTask(destinationStage, task);
  }

  public async manageTaskStage(
    projectId: number,
    taskId: number,
    stageId: number | null
  ) {
    const project = await this.findOne(projectId);
    const task = project.tasks.find((task) => task.id === taskId);
    if (!task) {
      throw new BadRequestException("Task is not part of this project");
    }
    if (stageId === null) {
      return this.stagesService.removeTask(task.stage.id, task.id);
    }

    const stage = project.stages.find((stage) => stage.id === stageId);
    if (!stage) {
      throw new BadRequestException("Stage is not part of this project");
    }
    return this.stagesService.addTask(stage, task);
  }

  public async manageMemberType(
    projectId: number,
    memberId: number,
    promotion: boolean
  ) {
    const project = await this.findOne(projectId);
    const member = project.members.find((member) => member.id === memberId);
    if (!member) {
      throw new BadRequestException("Member is not part of this project");
    }
    if (member.memberType === "Owner") {
      throw new BadRequestException(
        `Can't ${promotion ? "promote" : "demote"} owner`
      );
    }
    if (member.memberType === "Admin" && promotion) {
      throw new BadRequestException("Can't demote admin");
    }
    if (member.memberType === "User" && !promotion) {
      throw new BadRequestException("Can't promote user");
    }
    return this.membersService.update(member.id, {
      memberType: promotion ? "Admin" : "User",
    });
  }

  public async removeMember(
    projectId: number,
    userId: number,
    issuerId: number
  ) {
    const member = await this.membersService.findMember(userId, projectId);

    if (userId === issuerId) {
      if (member.memberType === "Owner") {
        throw new BadRequestException(
          "Can't leave project as owner. Please transfer ownership first."
        );
      } else {
        return this.membersService.remove(member.id);
      }
    }

    const issuer = await this.membersService.findMember(issuerId, projectId);

    if (member.project.id !== projectId) {
      throw new ForbiddenException("Member is not part of this project");
    }

    if (issuer.memberType === "Admin" && member.memberType === "Admin") {
      throw new ForbiddenException("Admins can't remove other admins");
    }

    if (member.memberType === "Owner") {
      throw new ForbiddenException("Can't remove owner");
    }

    return this.membersService.remove(member.id);
  }

  public async removeStage(projectId: number, stageId: number) {
    const stage = await this.stagesService.findOne(stageId);
    if (stage.project.id !== projectId) {
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
    project.stagesOrder = project.stagesOrder.filter((id) => id !== stageId);
    await this.projectRepository.update(projectId, {
      stagesOrder: project.stagesOrder,
    });
    return this.stagesService.remove(stageId);
  }

  public async removeTask(projectId: number, taskId: number) {
    const task = await this.tasksService.findOne(taskId);
    if (task.project.id !== projectId) {
      throw new BadRequestException("Task is not part of this project");
    }
    await this.stagesService.removeTask(task.stage.id, task.id);
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
      project.stagesOrder.map(async (stageId: number) => {
        return await this.stagesService.findOne(stageId);
      })
    );
    delete project.stagesOrder;
    delete project.members;
    return {
      ...project,
      stages,
      members: await this.findMembers(project.id),
      tasks: await this.findTasks(project.id),
      unstagedTasks: (await this.findTasks(project.id)).filter((task) => {
        return !task.stage;
      }),
    };
  }
}
