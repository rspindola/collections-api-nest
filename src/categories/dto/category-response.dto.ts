import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 1, description: 'ID identificador da categoria' })
  id: number;

  @ApiProperty({ example: 'Mangás', description: 'Nome da categoria' })
  name: string;

  @ApiProperty({
    example: 'mangas',
    description: 'Slug gerado a partir do nome',
  })
  slug: string;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Data de criação',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Data da última atualização',
  })
  updatedAt: Date;
}
