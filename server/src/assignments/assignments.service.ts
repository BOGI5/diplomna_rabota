import { Injectable } from "@nestjs/common";
import { CreateAssignmentDto } from "./dto/create-assignment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Assignment } from "./entities/assignment.entity";
import { Repository } from "typeorm";

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>
  ) {}

  create(createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentRepository.save(createAssignmentDto);
  }

  findAll() {
    return this.assignmentRepository.find();
  }

  findOne(id: number) {
    return this.assignmentRepository.findOne({ where: { id } });
  }

  findByTaskId(taskId: number) {
    return this.assignmentRepository.find({ where: { taskId } });
  }

  findByMemberId(memberId: number) {
    return this.assignmentRepository.find({ where: { memberId } });
  }

  remove(id: number) {
    return this.assignmentRepository.delete(id);
  }
}
