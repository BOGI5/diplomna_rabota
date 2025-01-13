import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";

@UseGuards(AccessTokenGuard)
@Controller("me")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get("tasks")
  findAssignments(@Req() req) {
    return this.profileService.findTasks(req.user.id);
  }

  @Get("projects")
  findProjects(@Req() req) {
    return this.profileService.findAllProjects(req.user.id);
  }

  @Get("projects/owner")
  findOwnerProjects(@Req() req) {
    return this.profileService.findOwnerProjects(req.user.id);
  }

  @Get("projects/admin")
  findAdminProjects(@Req() req) {
    return this.profileService.findAdminProjects(req.user.id);
  }

  @Get("projects/member")
  findMembersProjects(@Req() req) {
    return this.profileService.findMembersProjects(req.user.id);
  }
}
