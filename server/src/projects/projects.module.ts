import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectsService } from "./projects.service";
import { ProjectsController } from "./projects.controller";
import { MembersModule } from "src/members/members.module";
import { StagesModule } from "src/stages/stages.module";
import { TasksModule } from "src/tasks/tasks.module";
import { Project } from "./entities/project.entity";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    MembersModule,
    StagesModule,
    TasksModule,
    UsersModule,
    TypeOrmModule.forFeature([Project]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
