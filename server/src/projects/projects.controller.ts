import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { AccessTokenGuard } from "src/auth/guards/accessToken.guard";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Req() req, @Body(ValidationPipe) createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  // @UseGuards(AccessTokenGuard)
  // @Get("me")
  // findUserProjects(@Req() req) {
  //   return this.projectsService.findUserProjects(req.user.id);
  // }

  @UseGuards(AccessTokenGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(+id);
  }

  // @UseGuards(AccessTokenGuard)
  // @Get(":id/members")
  // findMembers(@Param("id") id: string) {
  //   return this.projectsService.findMembers(+id);
  // }

  @UseGuards(AccessTokenGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectsService.remove(+id);
  }
}
