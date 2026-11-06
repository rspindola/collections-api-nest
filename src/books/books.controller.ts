import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  CreateBookUploadDto,
  UpdateBookUploadDto,
} from './dto/book-upload.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BookFilterDto } from './dto/book-filter.dto';
import { multerOptions } from './config/multer.config';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiValidationErrorResponse,
  ApiNotFoundResponse,
  ApiAuthUnauthorizedResponse,
  ApiForbiddenAccessResponse,
} from '../common/swagger';

@ApiTags('Books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar livros com paginação e filtros',
    description:
      'Retorna a lista paginada de livros cadastrados com o status de leitura/posse do usuário autenticado. Suporta busca por texto (search), filtro por coleção (collection_id), categoria (category_id) e status de leitura/posse.',
  })
  @ApiPaginatedResponse(BookResponseDto, {
    description: 'Lista paginada de livros retornada com sucesso.',
  })
  @ApiAuthUnauthorizedResponse()
  async index(@Request() req: any, @Query() filter: BookFilterDto) {
    const result = await this.booksService.getAll(req.user.id, filter);
    return {
      success: true,
      ...result,
      message: 'Successfully listed books',
    };
  }

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Cadastrar novo livro com capa (Admin)',
    description:
      'Cria um novo livro associado a uma coleção e permite upload opcional de capa. Exige perfil de administrador.',
  })
  @ApiBody({
    type: CreateBookUploadDto,
    description: 'Campos do livro e arquivo de imagem para capa.',
  })
  @ApiStandardResponse({
    type: BookResponseDto,
    status: HttpStatus.CREATED,
    description: 'Livro criado com sucesso.',
  })
  @ApiValidationErrorResponse('Dados inválidos para cadastro do livro.')
  @ApiAuthUnauthorizedResponse()
  @ApiForbiddenAccessResponse()
  @UseInterceptors(FileInterceptor('cover', multerOptions))
  async store(
    @Body() dto: CreateBookDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.booksService.store(dto, file?.filename);
    return {
      success: true,
      data: result,
      book: result,
      message: 'Successfully created book',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar detalhes de um livro por ID',
    description:
      'Retorna os dados completos do livro e o status de leitura/posse do usuário autenticado.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID numérico do livro',
  })
  @ApiStandardResponse({
    type: BookResponseDto,
    description: 'Detalhes do livro retornados com sucesso.',
  })
  @ApiNotFoundResponse('Livro não encontrado com o ID informado.')
  @ApiAuthUnauthorizedResponse()
  async show(@Request() req: any, @Param('id') id: string) {
    const result = await this.booksService.getById(+id, req.user.id);
    return {
      success: true,
      data: result,
      book: result,
      message: 'Successfully created show',
    };
  }

  @Put(':id')
  @Roles('admin')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Atualizar livro existente (Admin)',
    description:
      'Atualiza os dados de um livro e opcionalmente substitui a imagem da capa. Exige perfil de administrador.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID numérico do livro',
  })
  @ApiBody({
    type: UpdateBookUploadDto,
    description:
      'Campos para atualização do livro e novo arquivo de capa opcional.',
  })
  @ApiStandardResponse({
    type: BookResponseDto,
    description: 'Livro atualizado com sucesso.',
  })
  @ApiNotFoundResponse('Livro não encontrado.')
  @ApiValidationErrorResponse('Dados inválidos para atualização.')
  @ApiAuthUnauthorizedResponse()
  @ApiForbiddenAccessResponse()
  @UseInterceptors(FileInterceptor('cover', multerOptions))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.booksService.update(+id, dto, file?.filename);
    return {
      success: true,
      data: result,
      book: result,
      message: 'Successfully updated book',
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Remover livro do catálogo (Admin)',
    description:
      'Exclui permanentemente um livro e remove o arquivo físico da capa. Exige perfil de administrador.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID numérico do livro',
  })
  @ApiStandardResponse({
    type: BookResponseDto,
    description: 'Livro removido com sucesso.',
  })
  @ApiNotFoundResponse('Livro não encontrado.')
  @ApiAuthUnauthorizedResponse()
  @ApiForbiddenAccessResponse()
  async destroy(@Param('id') id: string) {
    const result = await this.booksService.delete(+id);
    return {
      success: true,
      data: result,
      book: result,
      message: 'Successfully delete book',
    };
  }
}
