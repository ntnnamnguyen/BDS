import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PublicationStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';
import type { PaginatedResponse } from '../../common/dto/pagination-query.dto.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import {
  AdminProjectsQueryDto,
  ProjectsQueryDto,
} from './dto/projects-query.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { UpdateProjectPageDto } from './dto/update-project-page.dto.js';

const projectSummarySelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  thumbnailUrl: true,
  publicationStatus: true,
  salesStatus: true,
  location: true,
  priceRange: true,
  legalStatus: true,
  expectedYield: true,
  features: true,
  analysis: true,
  featured: true,
  sortOrder: true,
  seoTitle: true,
  seoDescription: true,
  updatedAt: true,
} satisfies Prisma.ProjectSelect;

const publicProjectDetailSelect = {
  ...projectSummarySelect,
  publishedAt: true,
  page: {
    select: {
      blocks: true,
      version: true,
    },
  },
} satisfies Prisma.ProjectSelect;

const projectDetailInclude = {
  page: {
    select: {
      blocks: true,
      version: true,
    },
  },
} satisfies Prisma.ProjectInclude;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublished(query: ProjectsQueryDto) {
    const where: Prisma.ProjectWhereInput = {
      publicationStatus: PublicationStatus.PUBLISHED,
      featured: query.featured,
      salesStatus: query.salesStatus,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { location: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const skip = (query.page - 1) * query.limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        select: projectSummarySelect,
        orderBy: [
          { featured: 'desc' },
          { sortOrder: 'asc' },
          { updatedAt: 'desc' },
        ],
        skip,
        take: query.limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return this.paginate(data, total, query.page, query.limit);
  }

  async findPublishedBySlug(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        slug,
        publicationStatus: PublicationStatus.PUBLISHED,
      },
      select: publicProjectDetailSelect,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findAllAdmin(query: AdminProjectsQueryDto) {
    const where: Prisma.ProjectWhereInput = {
      publicationStatus: query.publicationStatus,
      featured: query.featured,
      salesStatus: query.salesStatus,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { slug: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const skip = (query.page - 1) * query.limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        include: projectDetailInclude,
        orderBy: [{ updatedAt: 'desc' }],
        skip,
        take: query.limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return this.paginate(data, total, query.page, query.limit);
  }

  async findAdminById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: projectDetailInclude,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(dto: CreateProjectDto) {
    const slug = dto.slug ?? this.slugify(dto.name);

    if (!slug) {
      throw new BadRequestException('Project name cannot produce a valid slug');
    }

    try {
      return await this.prisma.project.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          thumbnailUrl: dto.thumbnailUrl,
          location: dto.location,
          priceRange: dto.priceRange,
          salesStatus: dto.salesStatus,
          legalStatus: dto.legalStatus,
          expectedYield: dto.expectedYield,
          features: dto.features ?? [],
          analysis: dto.analysis as Prisma.InputJsonValue | undefined,
          featured: dto.featured,
          sortOrder: dto.sortOrder,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
          publicationStatus: PublicationStatus.DRAFT,
          page: { create: { blocks: [] } },
        },
        include: projectDetailInclude,
      });
    } catch (error: unknown) {
      this.rethrowKnownError(error);
    }
  }

  async update(id: string, dto: UpdateProjectDto) {
    try {
      return await this.prisma.project.update({
        where: { id },
        data: {
          ...dto,
          analysis: dto.analysis as Prisma.InputJsonValue | undefined,
        },
        include: projectDetailInclude,
      });
    } catch (error: unknown) {
      this.rethrowKnownError(error);
    }
  }

  async updatePage(id: string, dto: UpdateProjectPageDto) {
    const result = await this.prisma.projectPage.updateMany({
      where: { projectId: id, version: dto.expectedVersion },
      data: {
        blocks: dto.blocks as Prisma.InputJsonValue,
        version: { increment: 1 },
      },
    });

    if (result.count === 0) {
      const page = await this.prisma.projectPage.findUnique({
        where: { projectId: id },
        select: { id: true },
      });

      if (!page) {
        throw new NotFoundException('Project page not found');
      }

      throw new ConflictException(
        'Project page has changed; reload it before saving',
      );
    }

    return this.prisma.projectPage.findUniqueOrThrow({
      where: { projectId: id },
      select: { blocks: true, version: true },
    });
  }

  async publish(id: string) {
    return this.setPublicationStatus(
      id,
      PublicationStatus.PUBLISHED,
      new Date(),
    );
  }

  async archive(id: string) {
    return this.setPublicationStatus(id, PublicationStatus.ARCHIVED, null);
  }

  async removeDraft(id: string): Promise<void> {
    const result = await this.prisma.project.deleteMany({
      where: { id, publicationStatus: PublicationStatus.DRAFT },
    });

    if (result.count === 1) return;

    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    throw new ConflictException(
      'Only draft projects can be permanently deleted; archive published projects',
    );
  }

  private async setPublicationStatus(
    id: string,
    publicationStatus: PublicationStatus,
    publishedAt: Date | null,
  ) {
    try {
      return await this.prisma.project.update({
        where: { id },
        data: { publicationStatus, publishedAt },
        include: projectDetailInclude,
      });
    } catch (error: unknown) {
      this.rethrowKnownError(error);
    }
  }

  private paginate<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private rethrowKnownError(error: unknown): never {
    if (this.hasPrismaCode(error, 'P2002')) {
      throw new ConflictException('Project slug already exists');
    }

    if (this.hasPrismaCode(error, 'P2025')) {
      throw new NotFoundException('Project not found');
    }

    throw error;
  }

  private hasPrismaCode(error: unknown, code: string): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === code
    );
  }
}
