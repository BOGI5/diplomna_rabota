import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { CreateStageDto } from "./dto/create-stage.dto";
import { UpdateStageDto } from "./dto/update-stage.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Stage } from "./entities/stage.entity";
import { Repository } from "typeorm";
import { TasksService } from "src/tasks/tasks.service";

@Injectable()
export class StagesService {
  constructor(
    @InjectRepository(Stage) private stageRepository: Repository<Stage>,
    @Inject(forwardRef(() => TasksService)) private tasksService: TasksService
  ) {}

  create(createStageDto: CreateStageDto) {
    return this.stageRepository.save(createStageDto);
  }

  async findAll() {
    const stages = await this.stageRepository.find();
    return await Promise.all(
      stages.map(async (stage) => {
        return {
          ...stage,
          tasks: await this.tasksService.findByStageId(stage.id),
        };
      })
    );
  }

  async findOne(id: number) {
    return {
      ...(await this.stageRepository.findOne({ where: { id } })),
      tasks: await this.tasksService.findByStageId(id),
    };
  }

  async findByProjectId(projectId: number) {
    const stages = await this.stageRepository.find({ where: { projectId } });
    return await Promise.all(
      stages.map(async (stage) => {
        return {
          ...stage,
          tasks: await this.tasksService.findByStageId(stage.id),
        };
      })
    );
  }

  update(id: number, updateStageDto: UpdateStageDto) {
    delete updateStageDto.projectId;
    if (Object.keys(updateStageDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    return this.stageRepository.update(id, updateStageDto);
  }

  async remove(id: number) {
    const tasks = await this.tasksService.findByStageId(id);
    for (const task of tasks) {
      await this.tasksService.remove(task.id);
    }
    return this.stageRepository.delete(id);
  }
}
