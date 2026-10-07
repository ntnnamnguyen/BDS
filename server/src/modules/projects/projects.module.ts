import { Module } from '@nestjs/common';
import { AdminProjectsController } from './admin-projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { PublicProjectsController } from './public-projects.controller.js';

@Module({
  controllers: [PublicProjectsController, AdminProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
