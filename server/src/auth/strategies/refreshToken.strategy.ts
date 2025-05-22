import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserFromJwt } from "../dto/user-from-jwt.dto";
import { StrategiesEnum } from "../constants/strategies.constants";
import { COOKIE_NAMES } from "../constants/auth.constants";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  StrategiesEnum.JWT_REFRESH
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
        },
      ]),
      secretOrKey: configService.get<string>("JWT_REFRESH_SECRET"),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(@Req() req, payload: UserFromJwt): Promise<User> {
    const user = await this.usersService.findByEmail(payload.email);
    const accessToken = req.cookies[COOKIE_NAMES.ACCESS_TOKEN];
    const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
    if (
      !user ||
      !user.refreshToken ||
      !refreshToken ||
      user.refreshToken !== refreshToken ||
      !accessToken ||
      user.accessToken !== accessToken
    ) {
      throw new UnauthorizedException("Unauthorized");
    }
    return user;
  }
}
