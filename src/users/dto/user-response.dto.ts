import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID identificador do usuário' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ example: 'user@email.com', description: 'E-mail cadastrado' })
  email: string;

  @ApiProperty({
    example: 'user',
    enum: ['user', 'admin'],
    description: 'Nível de privilégio no sistema',
  })
  role: 'admin' | 'user';

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-01-01T00:00:00.000Z',
    description:
      'Data de verificação do e-mail (ou null se ainda não verificado)',
  })
  emailVerifiedAt?: Date | string | null;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Data de criação da conta',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Data da última alteração',
  })
  updatedAt: Date;
}
