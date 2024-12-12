import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { StagesService } from "src/stages/stages.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";
import { AssignmentsService } from "src/assignments/assignments.service";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @Inject(forwardRef(() => StagesService))
    private stagesService: StagesService,
    private assignmentsService: AssignmentsService
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const stage = await this.stagesService.findOne(createTaskDto.stageId);
    if (stage.projectId !== createTaskDto.projectId) {
      throw new BadRequestException("Stage does not belong to this project");
    }
    return this.taskRepository.save(createTaskDto);
  }

  findAll() {
    return this.taskRepository.find();
  }

  findOne(id: number) {
    return this.taskRepository.findOne({ where: { id } });
  }

  findByProjectId(projectId: number) {
    return this.taskRepository.find({ where: { projectId } });
  }

  findByStageId(stageId: number) {
    return this.taskRepository.find({ where: { stageId } });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    delete updateTaskDto.projectId;
    if (Object.keys(updateTaskDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    return this.taskRepository.update(id, updateTaskDto);
  }

  async remove(id: number) {
    const assignments = await this.assignmentsService.findByTaskId(id);
    for (const assignment of assignments) {
      await this.assignmentsService.remove(assignment.id);
    }
    return this.taskRepository.delete(id);
  }
}
