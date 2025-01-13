import { Controller, Get, Param, Delete, UseGuards } from "@nestjs/common";
import { MembersService } from "./members.service";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";

@Controller("members")
@UseGuards(AccessTokenGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.membersService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.membersService.remove(+id);
  }
}
