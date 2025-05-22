import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { In, Repository } from "typeorm";
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
    if (
      createTaskDto.stage &&
      createTaskDto.stage.project.id !== createTaskDto.project.id
    ) {
      throw new BadRequestException("Stage does not belong to this project");
    }
    return this.taskRepository.save(createTaskDto);
  }

  public async findAll(findRelatedMembers = true) {
    const tasks = await this.taskRepository.find({
      relations: { stage: true, project: true },
    });
    return await Promise.all(
      tasks.map(async (task) => {
        return await this.formatTask(task, findRelatedMembers);
      })
    );
  }

  public async findOne(id: number, findRelatedMembers = true) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: { stage: true, project: true },
    });
    return await this.formatTask(task, findRelatedMembers);
  }

  public async findMany(ids: number[], findRelatedMembers = true) {
    const tasks = await this.taskRepository.find({
      where: { id: In(ids) },
      relations: { stage: true, project: true },
    });
    return await Promise.all(
      tasks.map(async (task) => {
        return await this.formatTask(task, findRelatedMembers);
      })
    );
  }

  public async findByProjectId(projectId: number, findRelatedMembers = true) {
    const tasks = await this.taskRepository.find({
      where: { project: { id: projectId } },
      relations: { stage: true, project: true },
    });
    return await Promise.all(
      tasks.map(async (task) => {
        return await this.formatTask(task, findRelatedMembers);
      })
    );
  }

  public async findByStageId(stageId: number, findRelatedMembers = true) {
    const tasks = await this.taskRepository.find({
      where: { stage: { id: stageId } },
      relations: { stage: true, project: true },
    });
    return await Promise.all(
      tasks.map(async (task) => {
        return await this.formatTask(task, findRelatedMembers);
      })
    );
  }

  public update(id: number, updateTaskDto: UpdateTaskDto) {
    delete updateTaskDto.project;
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

  private async formatTask(task: Task, findRelatedMembers = true) {
    if (findRelatedMembers) {
      const assignedMembers = this.membersService.findMany(
        task.assignments.map((assignment) => assignment.member.id),
        false
      );
      delete task.assignments;
      return { ...task, assignedMembers: assignedMembers };
    } else {
      delete task.assignments;
      return task;
    }
  }
}
