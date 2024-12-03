import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req,
} from "@nestjs/common";
import { MembersService } from "./members.service";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";

@Controller("members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body(ValidationPipe) createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

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
  update(@Param("id") id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(+id, updateMemberDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.membersService.remove(+id);
  }
}
