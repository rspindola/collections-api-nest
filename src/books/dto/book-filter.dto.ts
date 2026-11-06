import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class BookFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'Naruto',
    description: 'Termo de busca por nome ou descrição do livro',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar livros pertencentes a uma coleção específica',
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  collection_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar livros por categoria temática (via coleção)',
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  category_id?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Filtrar livros marcados como lidos pelo usuário autenticado',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' || value === true || value === 1 || value === '1'
      ? true
      : value === 'false' || value === false || value === 0 || value === '0'
        ? false
        : undefined,
  )
  @IsBoolean()
  hasRead?: boolean;

  @ApiPropertyOptional({
    example: true,
    description:
      'Filtrar livros marcados como comprados pelo usuário autenticado',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' || value === true || value === 1 || value === '1'
      ? true
      : value === 'false' || value === false || value === 0 || value === '0'
        ? false
        : undefined,
  )
  @IsBoolean()
  haveBought?: boolean;
}
