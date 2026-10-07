import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AdminLeadsController } from './admin-leads.controller.js';
import { LeadsService } from './leads.service.js';
import { PublicLeadsController } from './public-leads.controller.js';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        limit: 20,
        ttl: 60_000,
      },
    ]),
  ],
  controllers: [PublicLeadsController, AdminLeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
