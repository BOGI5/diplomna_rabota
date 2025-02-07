import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  ValidationPipe,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGoogleUserDto } from "./dto/create-google-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { MembersService } from "src/members/members.service";

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
    const validationPipe = new ValidationPipe();
    await validationPipe.transform(createGoogleUserDto, {
      type: "body",
      metatype: CreateGoogleUserDto,
    });
    return this.userRepository.save(createGoogleUserDto);
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const validationPipe = new ValidationPipe();
    await validationPipe.transform(createUserDto, {
      type: "body",
      metatype: CreateUserDto,
    });
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
    const validationPipe = new ValidationPipe();
    await validationPipe.transform(updateUserDto, {
      type: "body",
      metatype: UpdateUserDto,
    });
    if (updateUserDto.email) {
      delete updateUserDto.email;
    }
    if (updateUserDto.password) {
      delete updateUserDto.password;
    }

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
