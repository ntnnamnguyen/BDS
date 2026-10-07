import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { jest } from '@jest/globals';
import type { EnvironmentVariables } from '../../config/env.validation.js';
import { AdminApiKeyGuard } from './admin-api-key.guard.js';

describe('AdminApiKeyGuard', () => {
  const expectedKey = 'a'.repeat(32);
  const configService = {
    get: jest.fn().mockReturnValue(expectedKey),
  } as unknown as ConfigService<EnvironmentVariables, true>;

  function contextFor(value?: string): ExecutionContext {
    const request = {
      header: jest.fn().mockReturnValue(value),
    } as unknown as Request;

    return {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
  }

  it('accepts the configured key', () => {
    const guard = new AdminApiKeyGuard(configService);

    expect(guard.canActivate(contextFor(expectedKey))).toBe(true);
  });

  it('rejects a missing or invalid key', () => {
    const guard = new AdminApiKeyGuard(configService);

    expect(() => guard.canActivate(contextFor())).toThrow(
      UnauthorizedException,
    );
    expect(() => guard.canActivate(contextFor('wrong'))).toThrow(
      UnauthorizedException,
    );
  });
});
