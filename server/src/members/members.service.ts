import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
    return this.memberRepository.save(createMemberDto).catch((error) => {
      if (error.code === "23505") {
        throw new BadRequestException(
          "User is already a member of this project"
        );
      }
      throw error;
    });
  }

  public async findAll() {
    const members = await this.memberRepository.find();
    return await Promise.all(
      members.map(async (member) => {
        return await this.formatMember(member);
      })
    );
  }

  public async findOne(id: number) {
    const member = await this.memberRepository.findOne({ where: { id } });
    return await this.formatMember(member);
  }

  public async findByProjectId(projectId: number) {
    const members = await this.memberRepository.find({ where: { projectId } });
    return await Promise.all(
      members.map(async (member) => {
        return await this.formatMember(member);
      })
    );
  }

  public async findByUserId(userId: number) {
    const members = await this.memberRepository.find({ where: { userId } });
    return await Promise.all(
      members.map(async (member) => {
        return await this.formatMember(member);
      })
    );
  }

  public async findMember(userId: number, projectId: number) {
    const member = await this.memberRepository.findOne({
      where: { userId, projectId },
    });
    return await this.formatMember(member);
  }

  public update(id: number, updateMemberDto: UpdateMemberDto) {
    delete updateMemberDto.projectId;
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

  private async formatMember(member: Member) {
    const assignments = await this.assignmentsService.findByMemberId(member.id);
    const assignedTasks = await Promise.all(
      assignments.map(async (assignment) => {
        return await this.tasksService.findOne(assignment.taskId);
      })
    );
    return {
      ...member,
      user: plainToInstance(
        User,
        await this.usersService.findOne(member.userId)
      ),
      assignedTasks,
    };
  }
}
