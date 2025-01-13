import { Injectable } from "@nestjs/common";
import { ProjectsService } from "src/projects/projects.service";
import { MembersService } from "src/members/members.service";
import { TasksService } from "src/tasks/tasks.service";
import { Member } from "src/members/entities/member.entity";

@Injectable()
export class ProfileService {
  constructor(
    private projectsService: ProjectsService,
    private membersService: MembersService,
    private tasksService: TasksService
  ) {}

  public async findTasks(userId: number) {
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

  public async findOwnerProjects(userId: number) {
    return await this.projectsService.findByOwner(userId);
  }

  public async findAdminProjects(userId: number) {
    const members = (await this.membersService.findByUserId(userId)).filter(
      (member) => member.memberType === "Admin"
    );
    return await this.findProjects(members);
  }

  public async findMembersProjects(userId: number) {
    const members = await this.membersService.findByUserId(userId);
    return await this.findProjects(members);
  }

  public async findAllProjects(userId: number) {
    const members = await this.membersService.findByUserId(userId);
    const ownerProjects = await this.projectsService.findByOwner(userId);
    const projects = [];
    projects.push(...(await this.findProjects(members)));
    projects.push(...ownerProjects);
    return projects;
  }

  private async findProjects(members: Member[]) {
    return await Promise.all(
      members.map(async (member) => {
        return await this.projectsService.findOne(member.projectId);
      })
    );
  }
}
