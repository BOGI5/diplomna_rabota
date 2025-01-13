import { BadRequestException, Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { MembersService } from "src/members/members.service";
import { StagesService } from "src/stages/stages.service";
import { TasksService } from "src/tasks/tasks.service";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
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
    private tasksService: TasksService,
    private usersService: UsersService
  ) {}

  public async create(createProjectDto: CreateProjectDto, ownerId: number) {
    const project = await this.projectRepository.save({
      ...createProjectDto,
      ownerId,
    });
    return project;
  }

  public async addMember(createMemberDto: CreateMemberDto) {
    const { ownerId } = await this.findOne(createMemberDto.projectId);
    if (createMemberDto.userId === ownerId) {
      throw new BadRequestException("Owner can't be added as a member");
    }
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

  public async findByOwner(ownerId: number) {
    let projects = await this.projectRepository.find({ where: { ownerId } });
    projects = await Promise.all(
      projects.map(async (project) => {
        return await this.formatProject(project);
      })
    );
    return projects;
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

  public update(id: number, updateProjectDto: UpdateProjectDto) {
    if (Object.keys(updateProjectDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    return this.projectRepository.update(id, updateProjectDto);
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
      owner: plainToInstance(
        User,
        await this.usersService.findOne(project.ownerId)
      ),
    };
  }
}
