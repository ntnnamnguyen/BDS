import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminApiKeyGuard } from '../../common/guards/admin-api-key.guard.js';
import { LeadsQueryDto } from './dto/leads-query.dto.js';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto.js';
import { LeadsService } from './leads.service.js';

@ApiTags('admin/leads')
@ApiSecurity('admin-api-key')
@UseGuards(AdminApiKeyGuard)
@Controller('admin/leads')
export class AdminLeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'List leads for administration' })
  findAll(@Query() query: LeadsQueryDto) {
    return this.leadsService.findAll(query);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update a lead status' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(id, dto);
  }
}
