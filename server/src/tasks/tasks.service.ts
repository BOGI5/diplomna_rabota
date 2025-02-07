import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { StagesService } from "src/stages/stages.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./entities/task.entity";
import { MembersService } from "src/members/members.service";
import { AssignmentsService } from "src/assignments/assignments.service";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @Inject(forwardRef(() => StagesService))
    private stagesService: StagesService,
    @Inject(forwardRef(() => MembersService))
    private membersService: MembersService,
    private assignmentsService: AssignmentsService
  ) {}

  public async create(createTaskDto: CreateTaskDto) {
    if (createTaskDto.stageId) {
      const stage = await this.stagesService.findOne(createTaskDto.stageId);
      if (stage.projectId !== createTaskDto.projectId) {
        throw new BadRequestException("Stage does not belong to this project");
      }
    }
    return this.taskRepository.save(createTaskDto);
  }

  public async findAll() {
    const tasks = await this.taskRepository.find();
    return await Promise.all(
      tasks.map(async (task) => {
        return await this.formatTask(task);
      })
    );
  }

  public async findOne(id: number) {
    const task = await this.taskRepository.findOne({ where: { id } });
    return await this.formatTask(task);
  }

  public async findByProjectId(projectId: number) {
    const tasks = await this.taskRepository.find({ where: { projectId } });
    return await Promise.all(
      tasks.map(async (task) => {
        return await this.formatTask(task);
      })
    );
  }

  public async findByStageId(stageId: number) {
    const tasks = await this.taskRepository.find({ where: { stageId } });
    return await Promise.all(
      tasks.map(async (task) => {
        return await this.formatTask(task);
      })
    );
  }

  public update(id: number, updateTaskDto: UpdateTaskDto) {
    delete updateTaskDto.projectId;
    if (Object.keys(updateTaskDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    return this.taskRepository.update(id, updateTaskDto);
  }

  public async remove(id: number) {
    const assignments = await this.assignmentsService.findByTaskId(id);
    for (const assignment of assignments) {
      await this.assignmentsService.remove(assignment.id);
    }
    return this.taskRepository.delete(id);
  }

  private async formatTask(task: Task) {
    const assignments = await this.assignmentsService.findByTaskId(task.id);
    return {
      ...task,
      assignedMembers: await Promise.all(
        assignments.map(async (assignment) => {
          return await this.membersService.findOne(assignment.memberId);
        })
      ),
    };
  }
}
