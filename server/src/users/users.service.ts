import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { MembersService } from "src/members/members.service";
import { CreateGoogleUserDto } from "./dto/create-google-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => MembersService))
    private membersService: MembersService
  ) {}

  public async createGoogleUser(
    createGoogleUserDto: CreateGoogleUserDto
  ): Promise<User> {
    return this.userRepository.save(createGoogleUserDto);
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  public findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  public async updateTokens(
    id: number,
    accessToken: string,
    refreshToken: string
  ) {
    return this.userRepository.update(id, { accessToken, refreshToken });
  }

  public async updatePassword(id: number, password: string) {
    return this.userRepository.update(id, { password });
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    delete updateUserDto.email;
    delete updateUserDto.password;
    delete updateUserDto.memberships;

    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException("Empty update data");
    }
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const members = await this.membersService.findByUserId(id);
    for (const member of members) {
      await this.membersService.remove(member.id);
    }
    return this.userRepository.delete(id);
  }
}
