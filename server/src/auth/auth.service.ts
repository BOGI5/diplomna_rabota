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
import {
  COOKIE_NAMES,
  TOKENS_EXPIRATION_TIME,
} from "./constants/auth.constants";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService
  ) {}

  async signInWithGoogle(
    user: GoogleUser,
    res: Response
  ): Promise<{
    firstName: string;
    lastName: string;
    picture: string | null;
    id: number;
  }> {
    if (!user) throw new BadRequestException("Unauthenticated");
    let existingUser = await this.usersService.findByEmail(user.email);
    if (!existingUser) existingUser = await this.registerGoogleUser(user);
    await this.generateTokens(existingUser);
    existingUser = await this.usersService.findByEmail(user.email);
    await this.setTokensToCookies(
      res,
      existingUser.accessToken,
      existingUser.refreshToken
    );
    return {
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      picture: existingUser.picture,
      id: existingUser.id,
    };
  }

  async signIn(
    userDto: LoginUserDto,
    res: Response
  ): Promise<{
    firstName: string;
    lastName: string;
    picture: string | null;
    id: number;
  }> {
    let user = await this.usersService.findByEmail(userDto.email);
    if (!user || !this.compareHashedData(userDto.password, user.password))
      throw new BadRequestException(["Invalid credentials"]);
    await this.generateTokens(user);
    user = await this.usersService.findByEmail(user.email);
    await this.setTokensToCookies(res, user.accessToken, user.refreshToken);
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      id: user.id,
    };
  }

  async signUp(
    userDto: CreateUserDto,
    res: Response
  ): Promise<{
    firstName: string;
    lastName: string;
    picture: string | null;
    id: number;
  }> {
    const existingUser = await this.usersService.findByEmail(userDto.email);
    if (existingUser) throw new BadRequestException(["User already exists"]);
    let user = await this.usersService.create({
      ...userDto,
      password: this.hashData(userDto.password),
    });
    await this.generateTokens(user);
    user = await this.usersService.findByEmail(user.email);
    await this.setTokensToCookies(res, user.accessToken, user.refreshToken);
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      id: user.id,
    };
  }

  async signOut(id: number, res: Response): Promise<void> {
    const user = await this.usersService.findOne(id);
    await this.clearTokensFromCookies(res);
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

  async refreshTokens(id: number, res: Response) {
    let user = await this.usersService.findOne(id);
    await this.generateTokens(user);
    user = await this.usersService.findOne(id);
    await this.clearTokensFromCookies(res);
    await this.setTokensToCookies(res, user.accessToken, user.refreshToken);
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

  private async setTokensToCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): Promise<void> {
    res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(
        Date.now() + TOKENS_EXPIRATION_TIME.COOKIE_EXPIRATION_TIME
      ),
    });
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(
        Date.now() + TOKENS_EXPIRATION_TIME.COOKIE_EXPIRATION_TIME
      ),
    });
  }

  private async clearTokensFromCookies(res: Response): Promise<void> {
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN);
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN);
  }
}
