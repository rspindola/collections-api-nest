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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
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

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar categorias',
    description: 'Retorna a lista paginada de todas as categorias cadastradas.',
  })
  @ApiPaginatedResponse(CategoryResponseDto, {
    description: 'Lista paginada de categorias retornada com sucesso.',
  })
  @ApiAuthUnauthorizedResponse()
  async index(@Query() pagination: PaginationDto) {
    const result = await this.categoriesService.getAll(pagination);
    return {
      success: true,
      ...result,
      message: 'Successfully listed categories',
    };
  }

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova categoria (Admin)',
    description:
      'Cadastra uma nova categoria no sistema. Exige permissão de administrador.',
  })
  @ApiStandardResponse({
    type: CategoryResponseDto,
    status: HttpStatus.CREATED,
    description: 'Categoria criada com sucesso.',
  })
  @ApiValidationErrorResponse('Dados inválidos para criação da categoria.')
  @ApiAuthUnauthorizedResponse()
  @ApiForbiddenAccessResponse()
  async store(@Body() dto: CreateCategoryDto) {
    const result = await this.categoriesService.store(dto);
    return {
      success: true,
      data: result,
      category: result,
      message: 'Successfully created category',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar categoria por ID',
    description: 'Retorna os detalhes de uma categoria específica.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID numérico da categoria',
  })
  @ApiStandardResponse({
    type: CategoryResponseDto,
    description: 'Categoria encontrada com sucesso.',
  })
  @ApiNotFoundResponse('Categoria não encontrada com o ID informado.')
  @ApiAuthUnauthorizedResponse()
  async show(@Param('id') id: string) {
    const result = await this.categoriesService.getById(+id);
    return {
      success: true,
      data: result,
      category: result,
      message: 'Successfully show category',
    };
  }

  @Put(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Atualizar categoria (Admin)',
    description:
      'Atualiza o nome e slug de uma categoria existente. Exige permissão de administrador.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID numérico da categoria a ser atualizada',
  })
  @ApiStandardResponse({
    type: CategoryResponseDto,
    status: HttpStatus.OK,
    description: 'Categoria atualizada com sucesso.',
  })
  @ApiNotFoundResponse('Categoria não encontrada.')
  @ApiValidationErrorResponse('Dados inválidos para atualização.')
  @ApiAuthUnauthorizedResponse()
  @ApiForbiddenAccessResponse()
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const result = await this.categoriesService.update(+id, dto);
    return {
      success: true,
      data: result,
      category: result,
      message: 'Successfully updated category',
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Remover categoria (Admin)',
    description:
      'Exclui permanentemente uma categoria existente. Exige permissão de administrador.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID numérico da categoria a ser removida',
  })
  @ApiStandardResponse({
    type: CategoryResponseDto,
    description: 'Categoria removida com sucesso.',
  })
  @ApiNotFoundResponse('Categoria não encontrada.')
  @ApiAuthUnauthorizedResponse()
  @ApiForbiddenAccessResponse()
  async destroy(@Param('id') id: string) {
    const category = await this.categoriesService.getById(+id);
    await this.categoriesService.delete(+id);
    return {
      success: true,
      data: category,
      category,
      message: 'Successfully delete category',
    };
  }
}
