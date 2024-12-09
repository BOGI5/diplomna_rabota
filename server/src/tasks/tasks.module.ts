import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
// import { TasksController } from "./tasks.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StagesModule } from "src/stages/stages.module";
import { Task } from "./entities/task.entity";

@Module({
  imports: [StagesModule, TypeOrmModule.forFeature([Task])],
  // controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
