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

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private assignmentsService: AssignmentsService
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    return this.memberRepository.save(createMemberDto).catch((error) => {
      if (error.code === "23505") {
        throw new BadRequestException(
          "User is already a member of this project"
        );
      }
      throw error;
    });
  }

  async findAll() {
    const members = await this.memberRepository.find();
    const membersWithDetails = await Promise.all(
      members.map(async (member) => {
        const user = plainToInstance(
          User,
          await this.usersService.findOne(member.userId)
        );
        const assignments = await this.assignmentsService.findByMemberId(
          member.id
        );
        return {
          ...member,
          user,
          assignments,
        };
      })
    );
    return membersWithDetails;
  }

  async findOne(id: number) {
    const member = await this.memberRepository.findOne({ where: { id } });
    return {
      ...member,
      user: plainToInstance(
        User,
        await this.usersService.findOne(member.userId)
      ),
      assignments: await this.assignmentsService.findByMemberId(member.id),
    };
  }

  async findByProjectId(projectId: number) {
    const members = await this.memberRepository.find({ where: { projectId } });
    const membersWithDetails = await Promise.all(
      members.map(async (member) => {
        const user = plainToInstance(
          User,
          await this.usersService.findOne(member.userId)
        );
        const assignments = await this.assignmentsService.findByMemberId(
          member.id
        );
        return {
          ...member,
          user,
          assignments,
        };
      })
    );
    return membersWithDetails;
  }

  async findByUserId(userId: number) {
    const members = await this.memberRepository.find({ where: { userId } });
    const membersWithDetails = await Promise.all(
      members.map(async (member) => {
        const user = plainToInstance(
          User,
          await this.usersService.findOne(member.userId)
        );
        const assignments = await this.assignmentsService.findByMemberId(
          member.id
        );
        return {
          ...member,
          user,
          assignments,
        };
      })
    );
    return membersWithDetails;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    delete updateMemberDto.projectId;
    delete updateMemberDto.userId;
    if (Object.keys(updateMemberDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    return this.memberRepository.update(id, updateMemberDto);
  }

  async remove(id: number) {
    const assignments = await this.assignmentsService.findByMemberId(id);
    for (const assignment of assignments) {
      await this.assignmentsService.remove(assignment.id);
    }
    return this.memberRepository.delete(id);
  }
}
