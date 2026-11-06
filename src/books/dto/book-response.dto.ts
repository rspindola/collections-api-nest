import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CollectionResponseDto } from '../../collections/dto/collection-response.dto';
import { BookGender } from '../../common/enums';

export class UserBookStatusDto {
  @ApiProperty({
    example: true,
    description: 'Indica se o usuário logado já leu este livro',
  })
  hasRead: boolean;

  @ApiProperty({
    example: false,
    description: 'Indica se o usuário logado possui/comprou este livro',
  })
  haveBought: boolean;
}

export class BookResponseDto {
  @ApiProperty({ example: 1, description: 'ID identificador do livro' })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'ID da coleção à qual o livro pertence',
  })
  collectionId: number;

  @ApiProperty({
    example: 'Naruto Vol. 1',
    description: 'Nome ou título do volume',
  })
  name: string;

  @ApiProperty({
    example: 'The start of the ninja journey.',
    description: 'Sinopse ou descrição do livro',
  })
  description: string;

  @ApiPropertyOptional({
    example: '2003-03-03',
    description: 'Data de publicação',
  })
  publishedAt?: string;

  @ApiPropertyOptional({ example: 'Shueisha', description: 'Editora original' })
  company?: string;

  @ApiPropertyOptional({
    example: 'Panini',
    description: 'Licenciadora nacional',
  })
  licensor?: string;

  @ApiPropertyOptional({
    example: 'http://localhost:3000/storage/covers/naruto-1.jpg',
    description: 'URL completa ou caminho relativo da imagem da capa',
  })
  cover?: string;

  @ApiPropertyOptional({
    enum: BookGender,
    example: BookGender.SHONEN,
    description: 'Gênero / demografia',
  })
  gender?: string;

  @ApiPropertyOptional({ example: 192, description: 'Número de páginas' })
  pages?: number;

  @ApiPropertyOptional({ example: 29.9, description: 'Preço de capa' })
  price?: number;

  @ApiProperty({
    type: () => UserBookStatusDto,
    description: 'Status do livro para o usuário autenticado na requisição',
  })
  userStatus: UserBookStatusDto;

  @ApiPropertyOptional({
    type: () => CollectionResponseDto,
    description: 'Dados da coleção vinculada (se carregada)',
  })
  collection?: CollectionResponseDto;

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
