import { Task } from "src/tasks/entities/task.entity";
import { Member } from "src/members/entities/member.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.assignments, {
    nullable: false,
  })
  task: Task;

  @ManyToOne(() => Member, (member) => member.assignments, {
    nullable: false,
  })
  member: Member;
}
