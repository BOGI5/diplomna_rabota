import { Assignment } from "src/assignments/entities/assignment.entity";
import { Project } from "src/projects/entities/project.entity";
import { Stage } from "src/stages/entities/stage.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.tasks, { nullable: false })
  project: Project;

  @ManyToOne(() => Stage, (stage) => stage.tasks, { nullable: true })
  stage: Stage | null;

  @OneToMany(() => Assignment, (assignment) => assignment.task, {
    cascade: true,
    eager: true,
  })
  assignments: Assignment[];

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string | null;

  @Column({ nullable: true })
  deadline: Date | null;
}
