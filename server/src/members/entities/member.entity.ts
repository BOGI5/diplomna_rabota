import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @OneToOne(() => User, (user: User) => user.id)
  userId: number;

  @Column()
  @OneToOne(() => Project, (project: Project) => project.id)
  projectId: number;

  @Column({ type: "enum", enum: ["Admin", "User"], default: "User" })
  memberType: string;
}
