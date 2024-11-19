import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { StrategiesEnum } from "../constants/strategies.constants";

@Injectable()
export class RefreshTokenGuard extends AuthGuard(StrategiesEnum.JWT_REFRESH) {}
