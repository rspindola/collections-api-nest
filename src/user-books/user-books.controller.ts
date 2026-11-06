import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserBooksService } from './user-books.service';
import { UpsertUserBookDto } from './dto/upsert-user-book.dto';
import { UserBookResponseDto } from './dto/user-book-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiValidationErrorResponse,
  ApiNotFoundResponse,
  ApiAuthUnauthorizedResponse,
} from '../common/swagger';

@ApiTags('User Books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-books')
export class UserBooksController {
  constructor(private readonly userBooksService: UserBooksService) {}

  @Put()
  @ApiOperation({
    summary: 'Registrar ou atualizar status do livro (Lido / Comprado)',
    description:
      'Salva ou altera o status de leitura (`hasRead`) e posse (`haveBought`) de um determinado livro para o usuário logado.',
  })
  @ApiStandardResponse({
    type: UserBookResponseDto,
    dataKey: 'userBook',
    description: 'Status do livro salvo com sucesso.',
  })
  @ApiValidationErrorResponse('Dados inválidos para o registro de status.')
  @ApiAuthUnauthorizedResponse()
  async upsert(@Request() req: any, @Body() dto: UpsertUserBookDto) {
    const result = await this.userBooksService.upsert(req.user.id, dto);
    return {
      success: true,
      userBook: result,
      message: 'Successfully updated book status',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar estante pessoal do usuário logado',
    description:
      'Retorna a lista de todos os livros marcados como lidos ou comprados pelo usuário autenticado.',
  })
  @ApiStandardResponse({
    type: UserBookResponseDto,
    dataKey: 'userBooks',
    isArray: true,
    description: 'Lista de status de livros retornada com sucesso.',
  })
  @ApiAuthUnauthorizedResponse()
  async index(@Request() req: any) {
    const result = await this.userBooksService.findByUser(req.user.id);
    return {
      success: true,
      userBooks: result,
      message: 'Successfully listed user book statuses',
    };
  }

  @Get(':bookId')
  @ApiOperation({
    summary: 'Buscar status do usuário para um livro específico',
    description:
      'Retorna se o usuário autenticado já leu ou comprou o livro com o ID informado.',
  })
  @ApiParam({
    name: 'bookId',
    type: Number,
    example: 1,
    description: 'ID numérico do livro',
  })
  @ApiStandardResponse({
    type: UserBookResponseDto,
    dataKey: 'userBook',
    description: 'Status do livro retornado com sucesso.',
  })
  @ApiNotFoundResponse('Status não encontrado para o livro especificado.')
  @ApiAuthUnauthorizedResponse()
  async show(@Request() req: any, @Param('bookId') bookId: string) {
    const result = await this.userBooksService.findOne(req.user.id, +bookId);
    return {
      success: true,
      userBook: result,
      message: 'Successfully fetched book status',
    };
  }
}
