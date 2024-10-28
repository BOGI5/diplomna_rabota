import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { GoogleOAuthGuard } from "./guards/google-oauth.guard";
import { JwtGuard } from "./guards/jwt-auth.guard";
import { LoginUserDto } from "src/users/dto/login-user.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOAuthGuard)
  @Get("google")
  async googleAuth(@Req() req) {
    console.log(req.user);
  }

  @UseGuards(GoogleOAuthGuard)
  @Get("google-auth-redirect")
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { encodedUser } = await this.authService.signInWithGoogle(
      req.user,
      res
    );
    return res.redirect(
      `${process.env.GOOGLE_REDIRECT_URL_CLIENT_REACT}?jwtUser=${encodedUser}`
    );
  }

  @Post("sign-in")
  async signIn(
    @Body(ValidationPipe) loginUserDto: LoginUserDto,
    @Res() res: Response
  ) {
    const { encodedUser } = await this.authService.signIn(loginUserDto, res);
    res.send({ encodedUser });
  }

  @Post("sign-up")
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Res() res: Response
  ) {
    const { encodedUser } = await this.authService.signUp(createUserDto, res);
    res.send({ encodedUser });
  }

  @UseGuards(JwtGuard)
  @Get("protected-route")
  async protectedAuthRoute() {
    return "I am protected";
  }
}
