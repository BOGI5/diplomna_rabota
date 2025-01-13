import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MembersService } from "./members.service";
import { MembersController } from "./members.controller";
import { Member } from "./entities/member.entity";
import { AssignmentsModule } from "src/assignments/assignments.module";
import { UsersModule } from "src/users/users.module";
import { TasksModule } from "src/tasks/tasks.module";

@Module({
  imports: [
    AssignmentsModule,
    forwardRef(() => UsersModule),
    forwardRef(() => TasksModule),
    TypeOrmModule.forFeature([Member]),
  ],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
