import { Assignment } from "src/assignments/entities/assignment.entity";
import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Index } from "typeorm";

@Entity()
@Index(["user", "project"], { unique: true })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.memberships, {
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Project, (project) => project.members, {
    nullable: false,
  })
  project: Project;

  @OneToMany(() => Assignment, (assignment) => assignment.member, {
    cascade: true,
    eager: true,
  })
  assignments: Assignment[];

  @Column({ type: "enum", enum: ["Owner", "Admin", "User"], default: "User" })
  memberType: string;
}
