import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminApiKeyGuard } from '../../common/guards/admin-api-key.guard.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { AdminProjectsQueryDto } from './dto/projects-query.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { UpdateProjectPageDto } from './dto/update-project-page.dto.js';
import { ProjectsService } from './projects.service.js';

@ApiTags('admin/projects')
@ApiSecurity('admin-api-key')
@UseGuards(AdminApiKeyGuard)
@Controller('admin/projects')
export class AdminProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List projects for administration' })
  findAll(@Query() query: AdminProjectsQueryDto) {
    return this.projectsService.findAllAdmin(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a draft project and empty page' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id for administration' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findAdminById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project metadata' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }

  @Put(':id/page')
  @ApiOperation({ summary: 'Replace page blocks using optimistic locking' })
  updatePage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectPageDto,
  ) {
    return this.projectsService.updatePage(id, dto);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a project' })
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.publish(id);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive a project' })
  archive(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.archive(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Permanently delete a draft project' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.projectsService.removeDraft(id);
  }
}
