import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BooksRepository } from './repositories/books.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository],
  exports: [BooksService, BooksRepository],
})
export class BooksModule {}
