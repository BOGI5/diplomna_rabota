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
import { Task } from "src/tasks/entities/task.entity";

@Injectable()
export class StagesService {
  constructor(
    @InjectRepository(Stage) private stageRepository: Repository<Stage>,
    @Inject(forwardRef(() => TasksService)) private tasksService: TasksService
  ) {}

  public create(createStageDto: CreateStageDto) {
    return this.stageRepository.save({ ...createStageDto, tasksOrder: [] });
  }

  public async addTask(stage: Stage, task: Task) {
    stage = await this.stageRepository.findOne({
      where: { id: stage.id },
      relations: { tasks: true, project: true },
    });
    stage.tasksOrder.push(task.id);
    await this.tasksService.update(task.id, { stage });
    return this.stageRepository.update(stage.id, {
      tasksOrder: stage.tasksOrder,
    });
  }

  public async findAll() {
    const stages = await this.stageRepository.find({
      relations: { tasks: true, project: true },
    });
    return await Promise.all(
      stages.map(async (stage) => {
        return await this.formatStage(stage);
      })
    );
  }

  public async findOne(id: number) {
    return await this.formatStage(
      await this.stageRepository.findOne({
        where: { id },
        relations: { tasks: true, project: true },
      })
    );
  }

  public async findByProjectId(projectId: number) {
    const stages = await this.stageRepository.find({
      where: { project: { id: projectId } },
      relations: { tasks: true, project: true },
    });
    return await Promise.all(
      stages.map(async (stage) => {
        return await this.formatStage(stage);
      })
    );
  }

  public update(id: number, updateStageDto: UpdateStageDto) {
    delete updateStageDto.project;
    if (Object.keys(updateStageDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    return this.stageRepository.update(id, updateStageDto);
  }

  public async updateTaskOrder(
    stage: Stage,
    updateTaskOrderDto: UpdateTaskOrderDto
  ) {
    for (const task of stage.tasks) {
      if (!updateTaskOrderDto.taskOrder.includes(task.id)) {
        throw new BadRequestException("Not all tasks are included");
      }
    }
    for (const taskId of updateTaskOrderDto.taskOrder) {
      if (!stage.tasksOrder.includes(taskId)) {
        throw new BadRequestException("Task does not belong to this stage");
      }
    }
    for (const taskId of stage.tasksOrder.map(Number)) {
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
    return this.stageRepository.update(stage.id, {
      tasksOrder: updateTaskOrderDto.taskOrder,
    });
  }

  public async removeTask(stage: Stage, task: Task) {
    stage.tasksOrder = stage.tasksOrder.filter((id) => id !== task.id);
    await this.tasksService.update(task.id, { stage: null });
    return this.stageRepository.update(stage.id, {
      tasksOrder: stage.tasksOrder,
    });
  }

  public async remove(id: number) {
    const tasks = await this.tasksService.findByStageId(id);
    for (const task of tasks) {
      await this.tasksService.remove(task.id);
    }
    return this.stageRepository.delete(id);
  }

  private async formatStage(stage: Stage) {
    const orderedTasks = stage.tasksOrder.map((id) =>
      stage.tasks.find((task) => task.id === id)
    );
    delete stage.tasksOrder;
    delete stage.tasks;
    return {
      ...stage,
      tasks: orderedTasks,
    };
  }
}
