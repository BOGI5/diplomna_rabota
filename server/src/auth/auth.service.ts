import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { BadRequestException, Injectable } from "@nestjs/common";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { LoginUserDto } from "src/users/dto/login-user.dto";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { GoogleUser } from "./interfaces/auth.interfaces";
import { TOKENS_EXPIRATION_TIME } from "./constants/auth.constants";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService
  ) {}

  async signInWithGoogle(user: GoogleUser, res: Response): Promise<User> {
    if (!user) throw new BadRequestException("Unauthenticated");
    let existingUser = await this.usersService.findByEmail(user.email);
    if (!existingUser) existingUser = await this.registerGoogleUser(user);
    await this.generateTokens(existingUser);
    existingUser = await this.usersService.findByEmail(user.email);
    // this.setTokensToHeaders(res, accessToken, refreshToken);
    return existingUser;
  }

  async signIn(userDto: LoginUserDto, res: Response): Promise<User> {
    let user = await this.usersService.findByEmail(userDto.email);
    if (!user || !this.compareHashedData(userDto.password, user.password))
      throw new BadRequestException(["Invalid credentials"]);
    await this.generateTokens(user);
    user = await this.usersService.findByEmail(user.email);
    user.password = null;
    // await this.setTokensToHeaders(res, accessToken, refreshToken);
    return user;
  }

  async signUp(userDto: CreateUserDto, res: Response): Promise<User> {
    const existingUser = await this.usersService.findByEmail(userDto.email);
    if (existingUser) throw new BadRequestException(["User already exists"]);
    let user = await this.usersService.create({
      ...userDto,
      password: this.hashData(userDto.password),
    });
    await this.generateTokens(user);
    user = await this.usersService.findByEmail(user.email);
    user.password = null;
    // await this.setTokensToHeaders(res, accessToken, refreshToken);
    return user;
  }

  async signOut(id: number, res: Response): Promise<void> {
    const user = await this.usersService.findOne(id);
    this.usersService.update(id, {
      ...user,
      accessToken: null,
      refreshToken: null,
    });
  }

  private async registerGoogleUser(user: GoogleUser): Promise<User> {
    return await this.usersService.createGoogleUser({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
    });
  }

  private hashData(data: string): string {
    const salt = genSaltSync(10);
    return hashSync(data, salt);
  }

  private compareHashedData(data: string, hashedData: string): boolean {
    return compareSync(data, hashedData);
  }

  async refreshTokens(id: number, res: Response): Promise<User> {
    let user = await this.usersService.findOne(id);
    await this.generateTokens(user);
    user = await this.usersService.findOne(id);
    user.password = null;
    // this.setTokensToHeaders(res, accessToken, refreshToken);
    return user;
  }

  private async generateTokens(user: User): Promise<void> {
    if (user.accessToken && user.refreshToken) {
      try {
        this.jwtService.verify(user.accessToken, {
          secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
        });
        return;
      } catch (error) {
        this.usersService.update(user.id, {
          ...user,
          accessToken: null,
          refreshToken: null,
        });
      }
    }

    const { id, email } = user;

    await this.usersService.update(user.id, {
      ...user,
      accessToken: await this.jwtService.signAsync(
        {
          id: id,
          sub: email,
        },
        {
          secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
          expiresIn: TOKENS_EXPIRATION_TIME.ACCESS_TOKEN,
        }
      ),
      refreshToken: await this.jwtService.signAsync(
        {
          id: id,
          sub: email,
        },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: TOKENS_EXPIRATION_TIME.REFRESH_TOKEN,
        }
      ),
    });
  }

  // private async setTokensToHeaders(
  //   res: Response,
  //   accessToken: string,
  //   refreshToken: string
  // ): Promise<void> {
  //   // set access token to headers
  //   res.setHeader("Authorization", `Bearer ${accessToken}`);
  // }
}
