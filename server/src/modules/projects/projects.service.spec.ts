import { ConflictException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { PublicationStatus } from '../../generated/prisma/client.js';
import type { PrismaService } from '../../database/prisma.service.js';
import { ProjectsService } from './projects.service.js';

describe('ProjectsService', () => {
  it('creates a draft with a generated slug and empty page', async () => {
    const create = jest
      .fn<
        (args: {
          data: {
            name: string;
            page: { create: { blocks: unknown[] } };
            publicationStatus: PublicationStatus;
            slug: string;
          };
        }) => Promise<{ id: string }>
      >()
      .mockResolvedValue({ id: 'project-id' });
    const prisma = { project: { create } } as unknown as PrismaService;
    const service = new ProjectsService(prisma);

    await service.create({ name: 'Dự án Hồ Tây' });

    const [call] = create.mock.calls;
    expect(call?.[0].data).toMatchObject({
      name: 'Dự án Hồ Tây',
      slug: 'du-an-ho-tay',
      publicationStatus: PublicationStatus.DRAFT,
      page: { create: { blocks: [] } },
    });
  });

  it('rejects a stale page version', async () => {
    const updateMany = jest
      .fn<() => Promise<{ count: number }>>()
      .mockResolvedValue({ count: 0 });
    const findUnique = jest
      .fn<() => Promise<{ id: string }>>()
      .mockResolvedValue({ id: 'page-id' });
    const prisma = {
      projectPage: {
        updateMany,
        findUnique,
      },
    } as unknown as PrismaService;
    const service = new ProjectsService(prisma);

    await expect(
      service.updatePage('project-id', {
        blocks: [],
        expectedVersion: 1,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('does not delete a project that is no longer a draft', async () => {
    const deleteMany = jest
      .fn<() => Promise<{ count: number }>>()
      .mockResolvedValue({ count: 0 });
    const findUnique = jest
      .fn<() => Promise<{ id: string }>>()
      .mockResolvedValue({ id: 'project-id' });
    const prisma = {
      project: { deleteMany, findUnique },
    } as unknown as PrismaService;
    const service = new ProjectsService(prisma);

    await expect(service.removeDraft('project-id')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(deleteMany).toHaveBeenCalledWith({
      where: {
        id: 'project-id',
        publicationStatus: PublicationStatus.DRAFT,
      },
    });
  });
});
