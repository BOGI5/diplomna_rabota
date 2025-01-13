import { CanActivate, Injectable } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { MembersService } from "../../members/members.service";

@Injectable()
export default class ProjectGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private membersService: MembersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = request.params.id;

    if (!user) {
      return false;
    }

    if (!projectId) {
      return true;
    }

    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }

    const member = await this.membersService.findMember(user.id, projectId);
    if (!member) {
      return false;
    }

    return roles.includes(member.memberType);
  }
}
