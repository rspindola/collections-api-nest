import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookResponseDto } from '../../books/dto/book-response.dto';

export class UserBookResponseDto {
  @ApiProperty({ example: 1, description: 'ID identificador do vínculo' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID do usuário proprietário' })
  userId: number;

  @ApiProperty({ example: 42, description: 'ID do livro' })
  bookId: number;

  @ApiProperty({
    example: true,
    description: 'Indica se o usuário já leu o livro',
  })
  hasRead: boolean;

  @ApiProperty({
    example: true,
    description: 'Indica se o usuário comprou/possui o livro físico/digital',
  })
  haveBought: boolean;

  @ApiPropertyOptional({
    type: () => BookResponseDto,
    description: 'Dados do livro associado (quando carregado)',
  })
  book?: BookResponseDto;

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
