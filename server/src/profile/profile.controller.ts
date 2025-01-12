import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";

@UseGuards(AccessTokenGuard)
@Controller("me")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get("tasks")
  async findAssignments(@Req() req) {
    return await this.profileService.findTasks(req.user.id);
  }

  @Get("members")
  async findMembers(@Req() req) {
    return await this.profileService.findMembers(req.user.id);
  }

  @Get("projects")
  async findProjects(@Req() req) {
    return await this.profileService.findProjects(req.user.id);
  }
}
