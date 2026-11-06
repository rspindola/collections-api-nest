import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionResponseDto } from './dto/collection-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
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

@ApiTags('Collections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar coleções',
    description: 'Retorna uma lista paginada de todas as coleções cadastradas.',
  })
  @ApiPaginatedResponse(CollectionResponseDto, {
    description: 'Lista paginada de coleções retornada com sucesso.',
  })
  @ApiAuthUnauthorizedResponse()
  async index(@Query() pagination: PaginationDto) {
    const result = await this.collectionsService.getAll(pagination);
    return {
      success: true,
      ...result,
      message: 'Successfully listed collections',
    };
  }

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova coleção (Admin)',
    description:
      'Cadastra uma nova coleção vinculada a uma categoria existente. Exige permissão de administrador.',
  })
  @ApiStandardResponse({
    type: CollectionResponseDto,
    status: HttpStatus.CREATED,
    description: 'Coleção criada com sucesso.',
  })
  @ApiValidationErrorResponse('Dados inválidos para criação da coleção.')
  @ApiAuthUnauthorizedResponse()
  @ApiForbiddenAccessResponse()
  async store(@Body() dto: CreateCollectionDto) {
    const result = await this.collectionsService.store(dto);
    return {
      success: true,
      data: result,
      collection: result,
      message: 'Successfully created collection',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar coleção por ID',
    description:
      'Retorna os detalhes de uma coleção específica, incluindo dados da categoria e lista de livros relacionados.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID numérico da coleção',
  })
  @ApiStandardResponse({
    type: CollectionResponseDto,
    description: 'Coleção encontrada com sucesso.',
  })
  @ApiNotFoundResponse('Coleção não encontrada com o ID informado.')
  @ApiAuthUnauthorizedResponse()
  async show(@Param('id') id: string) {
    const result = await this.collectionsService.getById(+id);
    return {
      success: true,
      data: result,
      collection: result,
      message: 'Successfully show collection',
    };
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Atualizar coleção (Admin)',
    description:
      'Atualiza os dados de uma coleção existente. Exige permissão de administrador.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID numérico da coleção',
  })
  @ApiStandardResponse({
    type: CollectionResponseDto,
    description: 'Coleção atualizada com sucesso.',
  })
  @ApiNotFoundResponse('Coleção não encontrada.')
  @ApiValidationErrorResponse('Dados inválidos para atualização.')
  @ApiAuthUnauthorizedResponse()
  @ApiForbiddenAccessResponse()
  async update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    const result = await this.collectionsService.update(+id, dto);
    return {
      success: true,
      data: result,
      collection: result,
      message: 'Successfully updated collection',
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Remover coleção (Admin)',
    description:
      'Exclui permanentemente uma coleção. Exige permissão de administrador.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID numérico da coleção',
  })
  @ApiStandardResponse({
    type: CollectionResponseDto,
    description: 'Coleção removida com sucesso.',
  })
  @ApiNotFoundResponse('Coleção não encontrada.')
  @ApiAuthUnauthorizedResponse()
  @ApiForbiddenAccessResponse()
  async destroy(@Param('id') id: string) {
    const collection = await this.collectionsService.getById(+id);
    await this.collectionsService.delete(+id);
    return {
      success: true,
      data: collection,
      collection,
      message: 'Successfully delete collection',
    };
  }
}
