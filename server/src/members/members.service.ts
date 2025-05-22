import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { Member } from "./entities/member.entity";
import { AssignmentsService } from "src/assignments/assignments.service";
import { UsersService } from "src/users/users.service";
import { plainToInstance } from "class-transformer";
import { User } from "src/users/entities/user.entity";
import { TasksService } from "src/tasks/tasks.service";

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(forwardRef(() => TasksService)) private tasksService: TasksService,
    private assignmentsService: AssignmentsService
  ) {}

  public async create(createMemberDto: CreateMemberDto) {
    const user = await this.usersService.findOne(createMemberDto.userId);
    return this.memberRepository
      .save({ ...createMemberDto, user: user })
      .catch((error) => {
        if (error.code === "23505") {
          throw new BadRequestException(
            "User is already a member of this project"
          );
        }
        throw error;
      });
  }

  public async findAll(findRelatedTasks = true) {
    const members = await this.memberRepository.find();
    return await Promise.all(
      members.map(async (member) => {
        return await this.formatMember(member, findRelatedTasks);
      })
    );
  }

  public async findOne(id: number, findRelatedTasks = true) {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: { user: true, project: true },
    });
    return await this.formatMember(member, findRelatedTasks);
  }

  public async findMany(ids: number[], findRelatedTasks = true) {
    const members = await this.memberRepository.find({
      where: { id: In(ids) },
      relations: { user: true, project: true },
    });
    return await Promise.all(
      members.map(async (member) => {
        return await this.formatMember(member, findRelatedTasks);
      })
    );
  }

  public async findByProjectId(projectId: number, findRelatedTasks = true) {
    const members = await this.memberRepository.find({
      where: {
        project: { id: projectId },
      },
      relations: { user: true, project: true },
    });
    return await Promise.all(
      members.map(async (member) => {
        return await this.formatMember(member, findRelatedTasks);
      })
    );
  }

  public async findByUserId(userId: number, findRelatedTasks = true) {
    const members = await this.memberRepository.find({
      where: { user: { id: userId } },
      relations: { user: true, project: true },
    });
    return await Promise.all(
      members.map(async (member) => {
        return await this.formatMember(member, findRelatedTasks);
      })
    );
  }

  public async findMember(
    userId: number,
    projectId: number,
    findRelatedTasks = true
  ) {
    const member = await this.memberRepository.findOne({
      where: { user: { id: userId }, project: { id: projectId } },
      relations: { user: true, project: true },
    });
    return await this.formatMember(member, findRelatedTasks);
  }

  public update(id: number, updateMemberDto: UpdateMemberDto) {
    delete updateMemberDto.project;
    delete updateMemberDto.userId;
    if (Object.keys(updateMemberDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    return this.memberRepository.update(id, updateMemberDto);
  }

  public async remove(id: number) {
    const assignments = await this.assignmentsService.findByMemberId(id);
    for (const assignment of assignments) {
      await this.assignmentsService.remove(assignment.id);
    }
    return this.memberRepository.delete(id);
  }

  private async formatMember(member: Member, findRelatedTasks = true) {
    member.user = plainToInstance(User, member.user);
    if (findRelatedTasks) {
      const assignedTasks = await this.tasksService.findMany(
        member.assignments.map((assignment) => assignment.task.id),
        false
      );
      delete member.assignments;
      return { ...member, assignedTasks: assignedTasks };
    } else {
      delete member.assignments;
      return member;
    }
  }
}
