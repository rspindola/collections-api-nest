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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User Book Status')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-books')
export class UserBooksController {
  constructor(private readonly userBooksService: UserBooksService) {}

  @Put()
  @ApiOperation({ summary: 'Create or update book status (hasRead/haveBought) for logged in user' })
  @ApiResponse({ status: 200, description: 'Book status updated.' })
  async upsert(@Request() req: any, @Body() dto: UpsertUserBookDto) {
    const result = await this.userBooksService.upsert(req.user.id, dto);
    return {
      success: true,
      userBook: result,
      message: 'Successfully updated book status',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all book statuses for current user (My Collection page)' })
  @ApiResponse({ status: 200, description: 'List of user book statuses.' })
  async index(@Request() req: any) {
    const result = await this.userBooksService.findByUser(req.user.id);
    return {
      success: true,
      userBooks: result,
      message: 'Successfully listed user book statuses',
    };
  }

  @Get(':bookId')
  @ApiOperation({ summary: 'Get current user status for a specific book' })
  @ApiResponse({ status: 200, description: 'Book status returned.' })
  async show(@Request() req: any, @Param('bookId') bookId: string) {
    const result = await this.userBooksService.findOne(req.user.id, +bookId);
    return {
      success: true,
      userBook: result,
      message: 'Successfully fetched book status',
    };
  }
}
