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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Collection')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of collections' })
  @ApiResponse({ status: 200, description: 'Successful operation.' })
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
  @ApiOperation({ summary: 'Store new collection' })
  @ApiResponse({ status: 201, description: 'Successfully created collection.' })
  @ApiResponse({ status: 422, description: 'Validation error.' })
  async store(@Body() dto: CreateCollectionDto) {
    const result = await this.collectionsService.store(dto);
    return {
      success: true,
      collection: result,
      message: 'Successfully created collection',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get collection information' })
  @ApiResponse({ status: 200, description: 'Successful operation.' })
  @ApiResponse({ status: 404, description: 'Resource Not Found.' })
  async show(@Param('id') id: string) {
    const result = await this.collectionsService.getById(+id);
    return {
      success: true,
      collection: result,
      message: 'Successfully show collection',
    };
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update existing collection' })
  @ApiResponse({ status: 200, description: 'Successful operation.' })
  @ApiResponse({ status: 404, description: 'Resource Not Found.' })
  async update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    const result = await this.collectionsService.update(+id, dto);
    return {
      success: true,
      collection: result,
      message: 'Successfully updated collection',
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete existing collection' })
  @ApiResponse({ status: 200, description: 'Successful operation.' })
  @ApiResponse({ status: 404, description: 'Resource Not Found.' })
  async destroy(@Param('id') id: string) {
    const collection = await this.collectionsService.getById(+id);
    await this.collectionsService.delete(+id);
    return {
      success: true,
      collection,
      message: 'Successfully delete collection',
    };
  }
}
