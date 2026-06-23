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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { multerOptions } from './config/multer.config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('Book')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of books' })
  @ApiResponse({ status: 200, description: 'Successful operation.' })
  async index(@Request() req: any, @Query() pagination: PaginationDto) {
    const result = await this.booksService.getAll(req.user.id, pagination);
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
  @ApiOperation({ summary: 'Store new book' })
  @ApiResponse({ status: 201, description: 'Successfully created book.' })
  @ApiResponse({ status: 422, description: 'Validation error.' })
  @UseInterceptors(FileInterceptor('cover', multerOptions))
  async store(
    @Body() dto: CreateBookDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.booksService.store(dto, file?.filename);
    return {
      success: true,
      book: result,
      message: 'Successfully created book',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book information' })
  @ApiResponse({ status: 200, description: 'Successful operation.' })
  @ApiResponse({ status: 404, description: 'Resource Not Found.' })
  async show(@Request() req: any, @Param('id') id: string) {
    const result = await this.booksService.getById(+id, req.user.id);
    return {
      success: true,
      book: result,
      message: 'Successfully created show', // keeping Laravel's message format
    };
  }

  @Put(':id')
  @Roles('admin')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update existing book' })
  @ApiResponse({ status: 200, description: 'Successful operation.' })
  @ApiResponse({ status: 404, description: 'Resource Not Found.' })
  @UseInterceptors(FileInterceptor('cover', multerOptions))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.booksService.update(+id, dto, file?.filename);
    return {
      success: true,
      book: result,
      message: 'Successfully updated book',
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete existing book' })
  @ApiResponse({ status: 200, description: 'Successful operation.' })
  @ApiResponse({ status: 404, description: 'Resource Not Found.' })
  async destroy(@Param('id') id: string) {
    const result = await this.booksService.delete(+id);
    return {
      success: true,
      book: result,
      message: 'Successfully delete book',
    };
  }
}
