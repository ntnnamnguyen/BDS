import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectsQueryDto } from './dto/projects-query.dto.js';
import { ProjectsService } from './projects.service.js';

@ApiTags('projects')
@Controller('projects')
export class PublicProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List published projects' })
  findAll(@Query() query: ProjectsQueryDto) {
    return this.projectsService.findPublished(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a published project by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findPublishedBySlug(slug);
  }
}
