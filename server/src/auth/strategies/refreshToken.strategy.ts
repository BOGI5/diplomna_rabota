import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { StrategiesEnum } from "../constants/strategies.constants";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  StrategiesEnum.JWT_REFRESH
) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByEmail(payload.sub);
    if (
      !user ||
      !user.refreshToken ||
      user.refreshToken.match(ExtractJwt.fromAuthHeaderAsBearerToken())
    ) {
      throw new UnauthorizedException("Unauthorized");
    }
    return { ...payload, refreshToken: user.refreshToken };
  }
}
