import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';
import { UpdateBookDto } from './update-book.dto';

export class CreateBookUploadDto extends CreateBookDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Arquivo de imagem de capa (JPEG, PNG, WEBP - máx 2MB)',
  })
  cover?: any;
}

export class UpdateBookUploadDto extends UpdateBookDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Novo arquivo de imagem de capa para substituir o anterior',
  })
  cover?: any;
}
