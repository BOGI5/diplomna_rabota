import { Project } from "src/projects/entities/project.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Stage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Project, (project) => project.id)
  @Column()
  projectId: number;

  @Column()
  name: string;

  @Column({ type: "jsonb" })
  tasks: Number[];
}
