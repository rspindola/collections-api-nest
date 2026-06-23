import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertUserBookDto {
  @ApiProperty({ example: 1 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @ApiPropertyOptional({ example: true })
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  @IsBoolean()
  @IsOptional()
  hasRead?: boolean;

  @ApiPropertyOptional({ example: false })
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  @IsBoolean()
  @IsOptional()
  haveBought?: boolean;
}
