import { Injectable } from "@nestjs/common";
import { ProjectsService } from "src/projects/projects.service";
import { MembersService } from "src/members/members.service";
import { TasksService } from "src/tasks/tasks.service";

@Injectable()
export class ProfileService {
  constructor(
    private projectsService: ProjectsService,
    private membersService: MembersService,
    private tasksService: TasksService
  ) {}

  async findTasks(userId: number) {
    const members = await this.membersService.findByUserId(userId);
    const tasks = [];
    await Promise.all(
      members.map(async (member) => {
        member.assignments.map(async (assignment) => {
          tasks.push(await this.tasksService.findOne(assignment.taskId));
        });
      })
    );
    return tasks;
  }

  async findMembers(userId: number) {
    return await this.membersService.findByUserId(userId);
  }

  async findProjects(userId: number) {
    return await this.projectsService.findByOwner(userId);
  }
}
