import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StagesService } from "./stages.service";
import { StagesController } from "./stages.controller";
import { TasksModule } from "src/tasks/tasks.module";
import { Stage } from "./entities/stage.entity";

@Module({
  imports: [forwardRef(() => TasksModule), TypeOrmModule.forFeature([Stage])],
  controllers: [StagesController],
  providers: [StagesService],
  exports: [StagesService],
})
export class StagesModule {}
