import { Repository, In } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Assignment } from "./entities/assignment.entity";
import { CreateAssignmentDto } from "./dto/create-assignment.dto";

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

  public findMany(ids: number[]) {
    return this.assignmentRepository.find({
      where: { id: In(ids) },
    });
  }

  public findByTaskId(taskId: number) {
    return this.assignmentRepository.find({ where: { task: { id: taskId } } });
  }

  public findByMemberId(memberId: number) {
    return this.assignmentRepository.find({
      where: { member: { id: memberId } },
    });
  }

  public findAssignment(memberId: number, taskId: number) {
    return this.assignmentRepository.findOne({
      where: { member: { id: memberId }, task: { id: taskId } },
    });
  }

  public remove(id: number) {
    return this.assignmentRepository.delete(id);
  }
}
