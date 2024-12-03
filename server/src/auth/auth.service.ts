import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { BadRequestException, Injectable } from "@nestjs/common";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { LoginUserDto } from "src/users/dto/login-user.dto";
import { UsersService } from "src/users/users.service";
import { UpdatePasswordDto } from "./dto/update-password.dto";
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

  public async signInWithGoogle(
    user: GoogleUser,
    res: Response
  ): Promise<User> {
    if (!user) throw new BadRequestException("Unauthenticated");
    let existingUser = await this.usersService.findByEmail(user.email);
    if (!existingUser) existingUser = await this.registerGoogleUser(user);
    await this.generateTokens(existingUser);
    existingUser = await this.usersService.findByEmail(user.email);
    this.setTokensToCookies(
      res,
      existingUser.accessToken,
      existingUser.refreshToken
    );
    return existingUser;
  }

  public async signIn(userDto: LoginUserDto, res: Response): Promise<User> {
    let user = await this.usersService.findByEmail(userDto.email);
    if (
      !user ||
      !user.password ||
      !this.compareHashedData(userDto.password, user.password)
    )
      throw new BadRequestException("Invalid credentials");
    await this.generateTokens(user);
    user = await this.usersService.findByEmail(user.email);
    this.setTokensToCookies(res, user.accessToken, user.refreshToken);
    return user;
  }

  public async signUp(userDto: CreateUserDto, res: Response): Promise<User> {
    const existingUser = await this.usersService.findByEmail(userDto.email);
    if (existingUser) throw new BadRequestException("User already exists");
    let user = await this.usersService.create({
      ...userDto,
      password: this.hashData(userDto.password),
    });
    await this.generateTokens(user);
    user = await this.usersService.findByEmail(user.email);
    this.setTokensToCookies(res, user.accessToken, user.refreshToken);
    return user;
  }

  public async signOut(id: number, res: Response): Promise<void> {
    const user = await this.usersService.findOne(id);
    this.clearTokensFromCookies(res);
    this.usersService.updateTokens(user.id, null, null);
  }

  public async refreshTokens(id: number, res: Response) {
    let user = await this.usersService.findOne(id);
    await this.generateTokens(user);
    user = await this.usersService.findOne(id);
    this.clearTokensFromCookies(res);
    this.setTokensToCookies(res, user.accessToken, user.refreshToken);
  }

  public async updatePassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto
  ): Promise<void> {
    const user = await this.usersService.findOne(id);
    if (
      !user.password ||
      !this.compareHashedData(updatePasswordDto.currentPassword, user.password)
    ) {
      throw new BadRequestException("Invalid credentials");
    }
    await this.usersService.updatePassword(
      id,
      this.hashData(updatePasswordDto.newPassword)
    );
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

  private async generateTokens(user: User): Promise<void> {
    await this.usersService.updateTokens(user.id, null, null);

    const { id, email } = user;

    await this.usersService.updateTokens(
      user.id,
      this.jwtService.sign(
        {
          id: id,
          email: email,
        },
        {
          secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
          expiresIn: TOKENS_EXPIRATION_TIME.ACCESS_TOKEN,
        }
      ),
      this.jwtService.sign(
        {
          id: id,
          email: email,
        },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
          expiresIn: TOKENS_EXPIRATION_TIME.REFRESH_TOKEN,
        }
      )
    );
  }

  private setTokensToCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      // secure: true,
      expires: new Date(
        new Date().getTime() + TOKENS_EXPIRATION_TIME.COOKIE_EXPIRATION_TIME
      ),
    });
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      // secure: true,
      expires: new Date(
        new Date().getTime() + TOKENS_EXPIRATION_TIME.COOKIE_EXPIRATION_TIME
      ),
    });
  }

  private clearTokensFromCookies(res: Response): void {
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN);
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN);
  }
}
