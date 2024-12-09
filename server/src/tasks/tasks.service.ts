import { BadRequestException, Injectable } from "@nestjs/common";
import { StagesService } from "src/stages/stages.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private stagesService: StagesService
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
    return this.taskRepository.update(id, updateTaskDto);
  }

  remove(id: number) {
    return this.taskRepository.delete(id);
  }
}
