import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { MembersService } from "./members.service";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";

@Controller("members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.membersService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateMemberDto: UpdateMemberDto
  ) {
    return this.membersService.update(+id, updateMemberDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.membersService.remove(+id);
  }
}
