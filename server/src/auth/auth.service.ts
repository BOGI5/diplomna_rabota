import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CookieOptions, Response } from "express";
import { UsersService } from "src/users/users.service";

import { User } from "src/users/entities/user.entity";

import { GoogleUser } from "./interfaces/auth.interfaces";
import {
  COOKIE_NAMES,
  expiresTimeTokenMilliseconds,
} from "./constants/auth.constants";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { LoginUserDto } from "src/users/dto/login-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async signInWithGoogle(
    user: GoogleUser,
    res: Response
  ): Promise<{
    encodedUser: string;
  }> {
    if (!user) throw new BadRequestException("Unauthenticated");
    let existingUser = await this.usersService.findByEmail(user.email);
    if (!existingUser) existingUser = await this.registerGoogleUser(user);
    const encodedUser = this.encodeUserDataAsJwt(existingUser);
    this.setJwtTokenToCookies(res, existingUser);
    return {
      encodedUser,
    };
  }

  async signIn(
    userDto: LoginUserDto,
    res: Response
  ): Promise<{ encodedUser: string }> {
    const user = await this.usersService.findByEmail(userDto.email);
    if (!user) throw new BadRequestException("Invalid credentials");
    if (userDto.password !== user.password)
      throw new BadRequestException("Invalid credentials");
    const encodedUser = this.encodeUserDataAsJwt(user);
    this.setJwtTokenToCookies(res, user);
    return {
      encodedUser,
    };
  }

  async signUp(
    userDto: CreateUserDto,
    res: Response
  ): Promise<{ encodedUser: string }> {
    const existingUser = await this.usersService.findByEmail(userDto.email);
    if (existingUser) throw new BadRequestException("User already exists");
    const user = await this.usersService.create(userDto);
    const encodedUser = this.encodeUserDataAsJwt(user);
    this.setJwtTokenToCookies(res, user);
    return {
      encodedUser,
    };
  }

  private async registerGoogleUser(user: GoogleUser): Promise<User> {
    try {
      return await this.usersService.createGoogleUser({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  private encodeUserDataAsJwt(user: User) {
    const { id, email, firstName, lastName, picture } = user;
    return this.jwtService.sign({ id, email, firstName, lastName, picture });
  }

  setJwtTokenToCookies(res: Response, user: User) {
    const expirationDateInMilliseconds =
      new Date().getTime() + expiresTimeTokenMilliseconds;
    const cookieOptions: CookieOptions = {
      httpOnly: true, // this ensures that the cookie cannot be accessed through JavaScript!
      expires: new Date(expirationDateInMilliseconds),
    };

    res.cookie(
      COOKIE_NAMES.JWT,
      this.jwtService.sign({
        id: user.id,
        sub: {
          email: user.email,
        },
      }),
      cookieOptions
    );
  }
}
