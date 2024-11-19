import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserFromJwt } from "../interfaces/auth.interfaces";
import { StrategiesEnum } from "../constants/strategies.constants";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  StrategiesEnum.JWT
) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: UserFromJwt) {
    const user = await this.usersService.findByEmail(payload.sub);
    if (
      !user ||
      !user.accessToken ||
      user.accessToken.match(ExtractJwt.fromAuthHeaderAsBearerToken())
    ) {
      throw new UnauthorizedException("Unauthorized");
    }
    return payload;
  }
}
