import { Task } from "src/tasks/entities/task.entity";
import { Member } from "src/members/entities/member.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Task, (task) => task.id)
  @Column()
  taskId: number;

  @OneToOne(() => Member, (member) => member.id)
  @Column()
  memberId: number;
}
