import {
  ApiProperty,
  ApiPropertyOptional,
  ApiHideProperty,
} from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 42, description: 'Total de registros disponíveis' })
  total: number;

  @ApiProperty({ example: 1, description: 'Página atual' })
  page: number;

  @ApiProperty({
    example: 15,
    description: 'Quantidade de registros por página',
  })
  limit: number;

  @ApiProperty({ example: 3, description: 'Total de páginas' })
  lastPage: number;
}

export class StandardResponseDto<T = any> {
  @ApiProperty({
    example: true,
    description: 'Indica se a requisição foi bem-sucedida',
  })
  success: boolean;

  @ApiProperty({
    example: 'Operation completed successfully',
    description: 'Mensagem informativa da operação',
  })
  message: string;

  @ApiHideProperty()
  data?: T;
}

export class PaginatedResponseDto<T = any> {
  @ApiProperty({
    example: true,
    description: 'Indica se a requisição foi bem-sucedida',
  })
  success: boolean;

  @ApiHideProperty()
  data: T[];

  @ApiProperty({
    type: () => PaginationMetaDto,
    description: 'Metadados da paginação',
  })
  meta: PaginationMetaDto;

  @ApiProperty({
    example: 'Successfully listed records',
    description: 'Mensagem informativa',
  })
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    example: false,
    description: 'Indica que a requisição falhou',
  })
  success: boolean;

  @ApiProperty({
    example: 'Resource not found',
    description: 'Mensagem de erro',
  })
  message: string;

  @ApiPropertyOptional({
    example: {},
    description: 'Detalhes adicionais do erro',
  })
  data: any;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    example: false,
    description: 'Indica que a requisição falhou',
  })
  success: boolean;

  @ApiProperty({
    example: 'Error validation',
    description: 'Mensagem de validação',
  })
  message: string;

  @ApiProperty({
    example: ['name should not be empty', 'collection_id must be a number'],
    description:
      'Lista de mensagens de validação apontadas pelo class-validator',
    type: [String],
  })
  data: string[];
}
