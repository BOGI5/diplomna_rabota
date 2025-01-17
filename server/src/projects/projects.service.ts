import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { MembersService } from "src/members/members.service";
import { StagesService } from "src/stages/stages.service";
import { TasksService } from "src/tasks/tasks.service";
import { Project } from "./entities/project.entity";
import { CreateMemberDto } from "src/members/dto/create-member.dto";
import { CreateStageDto } from "src/stages/dto/create-stage.dto";
import { CreateTaskDto } from "src/tasks/dto/create-task.dto";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private membersService: MembersService,
    private stagesService: StagesService,
    private tasksService: TasksService
  ) {}

  public async create(createProjectDto: CreateProjectDto, ownerId: number) {
    const project = await this.projectRepository.save({
      ...createProjectDto,
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
    return this.stagesService.create(createStageDto);
  }

  public async addTask(createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  public async findAll() {
    let projects = await this.projectRepository.find();
    projects = await Promise.all(
      projects.map(async (project) => {
        return await this.formatProject(project);
      })
    );
    return projects;
  }

  public async findOne(id: number) {
    const project = await this.projectRepository.findOne({ where: { id } });
    return await this.formatProject(project);
  }

  public findMembers(id: number) {
    return this.membersService.findByProjectId(id);
  }

  public async findStages(id: number) {
    return await this.stagesService.findByProjectId(id);
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
    return this.projectRepository.update(id, updateProjectDto);
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
    return {
      ...project,
      members: await this.findMembers(project.id),
      stages: await this.findStages(project.id),
      tasks: await this.findTasks(project.id),
    };
  }
}
