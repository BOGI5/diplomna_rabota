import { BadRequestException, Injectable } from "@nestjs/common";
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
    const project = await this.projectRepository.save(createProjectDto);
    this.membersService.create({
      userId: ownerId,
      projectId: project.id,
      memberType: "Admin",
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

  async findAll() {
    let projects = await this.projectRepository.find();
    projects = await Promise.all(
      projects.map(async (project) => {
        return {
          ...project,
          members: await this.findMembers(project.id),
          stages: await this.findStages(project.id),
          tasks: await this.findTasks(project.id),
        };
      })
    );
    return projects;
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({ where: { id } });
    return {
      ...project,
      members: await this.findMembers(id),
      stages: await this.findStages(id),
      tasks: await this.findTasks(id),
    };
  }

  async findUserProjects(userId: number) {
    const members = await this.membersService.findByUserId(userId);
    const projects = await Promise.all(
      members.map(async (memberPromise) => {
        const member = await memberPromise;
        return await this.findOne(member.projectId);
      })
    );
    return projects;
  }

  findMembers(id: number) {
    return this.membersService.findByProjectId(id);
  }

  findStages(id: number) {
    return this.stagesService.findByProjectId(id);
  }

  findTasks(id: number) {
    return this.tasksService.findByProjectId(id);
  }

  // update(id: number, updateProjectDto: UpdateProjectDto) {
  //   if (Object.keys(updateProjectDto).length === 0) {
  //     throw new BadRequestException("Empty update data");
  //   }
  //   for (let member of updateProjectDto.members) {
  //     this.membersService.create({
  //       userId: member.userId,
  //       projectId: id,
  //       memberType: member.memberType,
  //     });
  //   }
  //   if (updateProjectDto.members) {
  //     delete updateProjectDto.members;
  //   }
  //   return this.projectRepository.update(id, updateProjectDto);
  // }

  remove(id: number) {
    this.membersService.findByProjectId(id).then((members) => {
      for (let member of members) {
        this.membersService.remove(member.id);
      }
    });
    return this.projectRepository.delete(id);
  }
}
