import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Project } from "./entities/project.entity";
import { MembersService } from "src/members/members.service";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private membersService: MembersService
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

  findAll() {
    return this.projectRepository.find();
  }

  findOne(id: number) {
    return this.projectRepository.findOne({ where: { id } });
  }

  // async findUserProjects(userId: number) {
  //   return await this.membersService.findByUserId(userId).then((members) => {
  //     return members.map((member) => this.findOne(member.projectId));
  //   });
  // }

  // findMembers(id: number) {
  //   return this.membersService.findByProjectId(id);
  // }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    if (Object.keys(updateProjectDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    for (let member of updateProjectDto.members) {
      this.membersService.create({
        userId: member.userId,
        projectId: id,
        memberType: member.memberType,
      });
    }
    if (updateProjectDto.members) {
      delete updateProjectDto.members;
    }
    return this.projectRepository.update(id, updateProjectDto);
  }

  remove(id: number) {
    this.membersService.findByProjectId(id).then((members) => {
      for (let member of members) {
        this.membersService.remove(member.id);
      }
    });
    return this.projectRepository.delete(id);
  }
}
