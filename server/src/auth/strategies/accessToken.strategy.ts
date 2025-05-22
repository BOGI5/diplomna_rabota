import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserFromJwt } from "../dto/user-from-jwt.dto";
import { StrategiesEnum } from "../constants/strategies.constants";
import { COOKIE_NAMES } from "../constants/auth.constants";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  StrategiesEnum.JWT
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.cookies[COOKIE_NAMES.ACCESS_TOKEN];
        },
      ]),
      secretOrKey: configService.get<string>("JWT_ACCESS_SECRET"),
      ignoreExpiration: false,
    });
  }

  async validate(payload: UserFromJwt): Promise<User> {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user || !user.accessToken) {
      throw new UnauthorizedException("Unauthorized");
    }
    return user;
  }
}
