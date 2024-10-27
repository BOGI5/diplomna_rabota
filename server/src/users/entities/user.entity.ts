import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("users")
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string | null;

  @Column({ nullable: true })
  picture: string | null;
}
