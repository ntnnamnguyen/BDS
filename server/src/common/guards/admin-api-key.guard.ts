import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import type { EnvironmentVariables } from '../../config/env.validation.js';

export const ADMIN_API_KEY_HEADER = 'x-admin-api-key';

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const suppliedKey = request.header(ADMIN_API_KEY_HEADER);
    const expectedKey = this.configService.get('ADMIN_API_KEY', {
      infer: true,
    });

    if (!suppliedKey || !this.keysMatch(suppliedKey, expectedKey)) {
      throw new UnauthorizedException('Invalid admin API key');
    }

    return true;
  }

  private keysMatch(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    return (
      leftBuffer.length === rightBuffer.length &&
      timingSafeEqual(leftBuffer, rightBuffer)
    );
  }
}
