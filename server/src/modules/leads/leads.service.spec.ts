import type { PrismaService } from '../../database/prisma.service.js';
import { jest } from '@jest/globals';
import { LeadsService } from './leads.service.js';

describe('LeadsService', () => {
  it('returns the existing lead for a repeated client request id', async () => {
    const existing = {
      id: 'lead-id',
      status: 'NEW',
      createdAt: new Date(),
    };
    const findUnique = jest
      .fn<() => Promise<typeof existing>>()
      .mockResolvedValue(existing);
    const create = jest.fn();
    const prisma = {
      lead: { findUnique, create },
    } as unknown as PrismaService;
    const service = new LeadsService(prisma);

    await expect(
      service.create({
        fullName: 'Nguyễn Văn An',
        phone: '0901234567',
        clientRequestId: 'request-1',
      }),
    ).resolves.toEqual(existing);
    expect(create).not.toHaveBeenCalled();
  });
});
