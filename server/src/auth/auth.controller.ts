import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { Response } from "express";
import { plainToInstance } from "class-transformer";
import { User } from "src/users/entities/user.entity";
import { AccessTokenGuard } from "./guards/accessToken.guard";
import { GoogleOAuthGuard } from "./guards/google-oauth.guard";
import { RefreshTokenGuard } from "./guards/refreshToken.guard";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { GoogleUserDto } from "./dto/google-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOAuthGuard)
  @Get("google")
  async googleAuth() {}

  @UseGuards(GoogleOAuthGuard)
  @Get("google-auth-redirect")
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const validatedUser = await new ValidationPipe({
      transform: true,
    }).transform(req.user, {
      type: "body",
      metatype: GoogleUserDto,
      data: req.user,
    });
    let user = await this.authService.signInWithGoogle(validatedUser, res);
    user = plainToInstance(User, user);
    delete user.email;
    return res.redirect(
      `${process.env.GOOGLE_REDIRECT_URL_CLIENT_REACT}?user=${encodeURIComponent(JSON.stringify(user))}`
    );
  }

  @Post("sign-in")
  async signIn(
    @Body(ValidationPipe) loginUserDto: LoginUserDto,
    @Res() res: Response
  ) {
    let user = await this.authService.signIn(loginUserDto, res);
    user = plainToInstance(User, user);
    delete user.email;
    res.send(user);
  }

  @Post("sign-up")
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Res() res: Response
  ) {
    let user = await this.authService.signUp(createUserDto, res);
    user = plainToInstance(User, user);
    delete user.email;
    res.send(user);
  }

  @UseGuards(AccessTokenGuard)
  @Get("sign-out")
  async signOut(@Req() req, @Res() res: Response) {
    await this.authService.signOut(req.user.id, res);
    res.send();
  }

  @UseGuards(RefreshTokenGuard)
  @Get("refresh")
  async refreshTokens(@Req() req, @Res() res: Response) {
    await this.authService.refreshTokens(req.user.id, res);
    res.send();
  }

  @UseGuards(AccessTokenGuard)
  @Patch("update-password")
  async updatePassword(
    @Req() req,
    @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response
  ) {
    await this.authService.updatePassword(req.user.id, updatePasswordDto);
    res.send();
  }
}
