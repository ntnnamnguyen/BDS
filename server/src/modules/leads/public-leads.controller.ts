import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { LeadsService } from './leads.service.js';

@ApiTags('leads')
@UseGuards(ThrottlerGuard)
@Controller('leads')
export class PublicLeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a contact or project enquiry' })
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }
}
