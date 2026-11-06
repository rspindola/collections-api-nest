import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class CollectionResponseDto {
  @ApiProperty({ example: 1, description: 'ID identificador da coleção' })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'ID da categoria à qual a coleção pertence',
  })
  categoryId: number;

  @ApiProperty({
    example: 'Dragon Ball Deluxe',
    description: 'Nome da coleção',
  })
  name: string;

  @ApiProperty({
    example: 'Coleção completa da saga Dragon Ball',
    description: 'Descrição da coleção',
  })
  description: string;

  @ApiProperty({ example: 'Panini', description: 'Editora / licenciadora' })
  licensor: string;

  @ApiProperty({
    example: 'Ongoing',
    description: 'Status de publicação (ex: Ongoing, Completed, Hiatus)',
  })
  status: string;

  @ApiProperty({ example: 'Shonen', description: 'Gênero / demografia' })
  gender: string;

  @ApiPropertyOptional({
    type: () => CategoryResponseDto,
    description: 'Dados da categoria vinculada',
  })
  category?: CategoryResponseDto;

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
