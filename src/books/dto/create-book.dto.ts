import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Naruto Vol. 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'The start of the ninja journey.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(900)
  description: string;

  @ApiProperty({ example: 1 })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @IsNotEmpty()
  collection_id: number;

  @ApiPropertyOptional({ example: '2003-03-03' })
  @IsOptional()
  publishedAt?: string;

  @ApiPropertyOptional({ example: 'Shueisha' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 'Panini' })
  @IsOptional()
  @IsString()
  licensor?: string;

  @ApiPropertyOptional({ example: 'Shonen' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: 192 })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  pages?: number;

  @ApiPropertyOptional({ example: 29.9 })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  price?: number;
}
