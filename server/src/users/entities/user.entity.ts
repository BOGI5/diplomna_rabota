import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Expose, Exclude } from "class-transformer";

@Entity("users")
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @Column()
  @Expose()
  email: string;

  @Column({ nullable: true })
  @Expose()
  picture: string | null;

  @Column({ nullable: true })
  @Exclude()
  password: string | null;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string | null;

  @Column({ nullable: true })
  @Exclude()
  accessToken: string | null;
}
