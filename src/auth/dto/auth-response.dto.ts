import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: 1, description: 'ID identificador do usuário' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  username: string;

  @ApiProperty({ example: 'user@email.com', description: 'E-mail cadastrado' })
  email: string;

  @ApiProperty({
    example: 'user',
    enum: ['user', 'admin'],
    description: 'Nível de acesso do usuário',
  })
  role: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description:
      'Token JWT para ser enviado no header Authorization: Bearer <token>',
  })
  access_token: string;
}
