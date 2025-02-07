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

  public create(createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentRepository.save(createAssignmentDto);
  }

  public findAll() {
    return this.assignmentRepository.find();
  }

  public findOne(id: number) {
    return this.assignmentRepository.findOne({ where: { id } });
  }

  public findByTaskId(taskId: number) {
    return this.assignmentRepository.find({ where: { taskId } });
  }

  public findByMemberId(memberId: number) {
    return this.assignmentRepository.find({ where: { memberId } });
  }

  public remove(id: number) {
    return this.assignmentRepository.delete(id);
  }
}
