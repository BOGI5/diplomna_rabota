import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGoogleUserDto } from "./dto/create-google-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createGoogleUser(
    createGoogleUserDto: CreateGoogleUserDto
  ): Promise<User> {
    const validationPipe = new ValidationPipe();
    await validationPipe.transform(createGoogleUserDto, {
      type: "body",
      metatype: CreateGoogleUserDto,
    });
    return this.userRepository.save(createGoogleUserDto);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const validationPipe = new ValidationPipe();
    await validationPipe.transform(createUserDto, {
      type: "body",
      metatype: CreateUserDto,
    });
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateTokens(id: number, accessToken: string, refreshToken: string) {
    return this.userRepository.update(id, { accessToken, refreshToken });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
