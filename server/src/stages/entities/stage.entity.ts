import { Project } from "src/projects/entities/project.entity";
import { Task } from "src/tasks/entities/task.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Stage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Project, (project) => project.stages, {
    nullable: false,
  })
  project: Project;

  @OneToMany(() => Task, (task) => task.stage, {
    cascade: true,
    eager: true,
  })
  tasks: Task[];

  @Column({ type: "jsonb" })
  tasksOrder: Number[];
}
