import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { plainToInstance } from "class-transformer";
import { User } from "./entities/user.entity";

@Controller("users")
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService
      .findAll()
      .then((users) => users.map((user) => plainToInstance(User, user)));
  }

  @Get("me")
  async findMe(@Req() req) {
    const user = await this.usersService.findOne(req.user.id);
    return plainToInstance(User, user);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOne(+id);
    return plainToInstance(User, user);
  }

  @Patch("me")
  async update(@Req() req, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(req.user.id, updateUserDto);
    return plainToInstance(User, user);
  }

  @Delete("me")
  remove(@Req() req) {
    return this.usersService.remove(req.user.id);
  }
}
