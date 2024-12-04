import { Injectable } from "@nestjs/common";
import { CreateStageDto } from "./dto/create-stage.dto";
import { UpdateStageDto } from "./dto/update-stage.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Stage } from "./entities/stage.entity";
import { Repository } from "typeorm";

@Injectable()
export class StagesService {
  constructor(
    @InjectRepository(Stage) private stageRepository: Repository<Stage>
  ) {}

  create(createStageDto: CreateStageDto) {
    return this.stageRepository.save(createStageDto);
  }

  findAll() {
    return this.stageRepository.find();
  }

  findOne(id: number) {
    return this.stageRepository.findOne({ where: { id } });
  }

  findByProjectId(projectId: number) {
    return this.stageRepository.find({ where: { projectId } });
  }

  update(id: number, updateStageDto: UpdateStageDto) {
    return this.stageRepository.update(id, updateStageDto);
  }

  remove(id: number) {
    return this.stageRepository.delete(id);
  }
}
