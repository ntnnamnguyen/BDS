import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

function normalizePhone(value: unknown): unknown {
  return typeof value === 'string' ? value.replace(/[^\d+]/g, '') : value;
}

function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class CreateLeadDto {
  @ApiProperty({ example: 'Nguyễn Văn An' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @ApiProperty({ example: '0901234567' })
  @Transform(({ value }) => normalizePhone(value))
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^\+?\d{8,15}$/)
  phone!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2_000)
  message?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  @Type(() => Object)
  interestData?: Record<string, unknown>;

  @ApiPropertyOptional({ example: '/contact' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  sourcePath?: string;

  @ApiPropertyOptional({ description: 'Client-generated idempotency key' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  clientRequestId?: string;
}
