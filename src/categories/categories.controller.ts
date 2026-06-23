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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of categories' })
  @ApiResponse({ status: 200, description: 'Successful operation.' })
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
  @ApiOperation({ summary: 'Store new category' })
  @ApiResponse({ status: 201, description: 'Successfully created category.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 422, description: 'Validation error.' })
  async store(@Body() dto: CreateCategoryDto) {
    const result = await this.categoriesService.store(dto);
    return {
      success: true,
      category: result,
      message: 'Successfully created category',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category information' })
  @ApiResponse({ status: 200, description: 'Successful operation.' })
  @ApiResponse({ status: 404, description: 'Resource Not Found.' })
  async show(@Param('id') id: string) {
    const result = await this.categoriesService.getById(+id);
    return {
      success: true,
      category: result,
      message: 'Successfully show category',
    };
  }

  @Put(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Update existing category' })
  @ApiResponse({ status: 202, description: 'Successful operation.' })
  @ApiResponse({ status: 404, description: 'Resource Not Found.' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const result = await this.categoriesService.update(+id, dto);
    return {
      success: true,
      category: result,
      message: 'Successfully updated category',
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete existing category' })
  @ApiResponse({ status: 200, description: 'Successful operation.' })
  @ApiResponse({ status: 404, description: 'Resource Not Found.' })
  async destroy(@Param('id') id: string) {
    const category = await this.categoriesService.getById(+id);
    await this.categoriesService.delete(+id);
    return {
      success: true,
      category,
      message: 'Successfully delete category',
    };
  }
}
