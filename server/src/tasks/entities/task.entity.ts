import { Project } from "src/projects/entities/project.entity";
import { Stage } from "src/stages/entities/stage.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Project, (project) => project.id)
  @Column()
  projectId: number;

  @OneToOne(() => Stage, (stage) => stage.id)
  @Column({ nullable: true })
  stageId: number | null;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string | null;

  @Column({ nullable: true })
  deadline: Date | null;
}
