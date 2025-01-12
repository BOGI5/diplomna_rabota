import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { ProjectsModule } from "src/projects/projects.module";
import { MembersModule } from "src/members/members.module";
import { TasksModule } from "src/tasks/tasks.module";

@Module({
  imports: [TasksModule, MembersModule, ProjectsModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
