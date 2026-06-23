import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ enum: ['admin', 'user'], example: 'admin' })
  @IsEnum(['admin', 'user'])
  @IsNotEmpty()
  role: 'admin' | 'user';
}
