import { Member } from "src/members/entities/member.entity";
import { Stage } from "src/stages/entities/stage.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string | null;

  @Column({ nullable: true })
  deadline: Date | null;

  @Column({ type: "jsonb" })
  stagesOrder: Number[];

  @OneToMany(() => Stage, (stage) => stage.project, {
    cascade: true,
    eager: true,
  })
  stages: Stage[];

  @OneToMany(() => Task, (task) => task.project, {
    cascade: true,
    eager: true,
  })
  tasks: Task[];

  @OneToMany(() => Member, (member) => member.project, {
    cascade: true,
    eager: true,
  })
  members: Member[];
}
