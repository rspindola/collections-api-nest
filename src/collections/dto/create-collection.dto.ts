import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionDto {
  @ApiProperty({ example: 'My Manga Collection' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'All my manga volumes' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Panini' })
  @IsString()
  @IsNotEmpty()
  licensor: string;

  @ApiProperty({ example: 'Ongoing' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 'Shonen' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  category_id: number;
}
