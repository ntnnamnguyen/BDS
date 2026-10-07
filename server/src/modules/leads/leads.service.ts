import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PublicationStatus } from '../../generated/prisma/client.js';
import type { PaginatedResponse } from '../../common/dto/pagination-query.dto.js';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { LeadsQueryDto } from './dto/leads-query.dto.js';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto.js';

const publicLeadSelect = {
  id: true,
  status: true,
  createdAt: true,
} satisfies Prisma.LeadSelect;

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLeadDto) {
    if (dto.clientRequestId) {
      const existing = await this.prisma.lead.findUnique({
        where: { clientRequestId: dto.clientRequestId },
        select: publicLeadSelect,
      });

      if (existing) return existing;
    }

    if (dto.projectId) {
      const projectExists = await this.prisma.project.count({
        where: {
          id: dto.projectId,
          publicationStatus: PublicationStatus.PUBLISHED,
        },
      });

      if (projectExists === 0) {
        throw new BadRequestException('Project is not available');
      }
    }

    try {
      return await this.prisma.lead.create({
        data: {
          fullName: dto.fullName.trim(),
          phone: dto.phone,
          email: dto.email?.trim().toLowerCase(),
          message: dto.message?.trim(),
          projectId: dto.projectId,
          interestData: dto.interestData as Prisma.InputJsonValue | undefined,
          sourcePath: dto.sourcePath,
          clientRequestId: dto.clientRequestId,
        },
        select: publicLeadSelect,
      });
    } catch (error: unknown) {
      if (dto.clientRequestId && this.hasPrismaCode(error, 'P2002')) {
        return this.prisma.lead.findUniqueOrThrow({
          where: { clientRequestId: dto.clientRequestId },
          select: publicLeadSelect,
        });
      }

      throw error;
    }
  }

  async findAll(query: LeadsQueryDto) {
    const where: Prisma.LeadWhereInput = {
      status: query.status,
      projectId: query.projectId,
      ...(query.search
        ? {
            OR: [
              { fullName: { contains: query.search, mode: 'insensitive' } },
              { phone: { contains: query.search } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const skip = (query.page - 1) * query.limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where,
        include: {
          project: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return this.paginate(data, total, query.page, query.limit);
  }

  async updateStatus(id: string, dto: UpdateLeadStatusDto) {
    try {
      return await this.prisma.lead.update({
        where: { id },
        data: { status: dto.status },
        include: {
          project: { select: { id: true, name: true, slug: true } },
        },
      });
    } catch (error: unknown) {
      if (this.hasPrismaCode(error, 'P2025')) {
        throw new NotFoundException('Lead not found');
      }

      throw error;
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

  private hasPrismaCode(error: unknown, code: string): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === code
    );
  }
}
