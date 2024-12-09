import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { Member } from "./entities/member.entity";

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>
  ) {}

  create(createMemberDto: CreateMemberDto) {
    return this.memberRepository.save(createMemberDto).catch((error) => {
      // handle only unique constraint error
      if (error.code === "23505") {
        throw new BadRequestException(
          "User is already a member of this project"
        );
      }
      throw error;
    });
  }

  findAll() {
    return this.memberRepository.find();
  }

  findOne(id: number) {
    return this.memberRepository.findOne({ where: { id } });
  }

  findByProjectId(projectId: number) {
    return this.memberRepository.find({ where: { projectId } });
  }

  findByUserId(userId: number) {
    return this.memberRepository.find({ where: { userId } });
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    if (Object.keys(updateMemberDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    return this.memberRepository.update(id, updateMemberDto);
  }

  remove(id: number) {
    return this.memberRepository.delete(id);
  }
}
