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
import { UpdateTaskOrderDto } from "./dto/update-task-order.dto";

@Injectable()
export class StagesService {
  constructor(
    @InjectRepository(Stage) private stageRepository: Repository<Stage>,
    @Inject(forwardRef(() => TasksService)) private tasksService: TasksService
  ) {}

  public create(createStageDto: CreateStageDto) {
    return this.stageRepository.save({ ...createStageDto, tasks: [] });
  }

  public async addTask(stageId: number, taskId: number) {
    const stage = await this.stageRepository.findOne({
      where: { id: stageId },
    });
    stage.tasks.push(taskId);
    await this.tasksService.update(taskId, { stageId });
    return this.stageRepository.update(stage.id, { tasks: stage.tasks });
  }

  public async findAll() {
    const stages = await this.stageRepository.find();
    return await Promise.all(
      stages.map(async (stage) => {
        return await this.formatStage(stage);
      })
    );
  }

  public async findOne(id: number) {
    return await this.formatStage(
      await this.stageRepository.findOne({ where: { id } })
    );
  }

  public async findByProjectId(projectId: number) {
    const stages = await this.stageRepository.find({ where: { projectId } });
    return await Promise.all(
      stages.map(async (stage) => {
        return await this.formatStage(stage);
      })
    );
  }

  public update(id: number, updateStageDto: UpdateStageDto) {
    delete updateStageDto.projectId;
    if (Object.keys(updateStageDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    return this.stageRepository.update(id, updateStageDto);
  }

  public async updateTaskOrder(
    id: number,
    updateTaskOrderDto: UpdateTaskOrderDto
  ) {
    const stage = await this.stageRepository.findOne({ where: { id } });
    for (const taskId of updateTaskOrderDto.taskOrder) {
      if (!stage.tasks.includes(taskId)) {
        throw new BadRequestException("Task does not belong to this stage");
      }
    }
    for (const taskId of stage.tasks.map(Number)) {
      if (!updateTaskOrderDto.taskOrder.includes(Number(taskId))) {
        throw new BadRequestException("All tasks must be included");
      }
    }
    if (
      new Set(updateTaskOrderDto.taskOrder).size !==
      updateTaskOrderDto.taskOrder.length
    ) {
      throw new BadRequestException("Duplicate tasks");
    }
    return this.stageRepository.update(id, {
      tasks: updateTaskOrderDto.taskOrder,
    });
  }

  public async removeTask(stageId: number, taskId: number) {
    const stage = await this.stageRepository.findOne({
      where: { id: stageId },
    });
    stage.tasks = stage.tasks.filter((id) => id !== taskId);
    await this.tasksService.update(taskId, { stageId: null });
    return this.stageRepository.update(stage.id, { tasks: stage.tasks });
  }

  public async remove(id: number) {
    const tasks = await this.tasksService.findByStageId(id);
    for (const task of tasks) {
      await this.tasksService.remove(task.id);
    }
    return this.stageRepository.delete(id);
  }

  private async formatStage(stage: Stage) {
    return {
      ...stage,
      tasks: await Promise.all(
        stage.tasks.map(async (taskId: number) => {
          return await this.tasksService.findOne(taskId);
        })
      ),
    };
  }
}
