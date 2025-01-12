import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { AssignmentsModule } from "src/assignments/assignments.module";
import { MembersModule } from "src/members/members.module";
import { ProjectsModule } from "src/projects/projects.module";

@Module({
  imports: [AssignmentsModule, MembersModule, ProjectsModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
