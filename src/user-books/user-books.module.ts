import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBook } from './entities/user-book.entity';
import { UserBooksController } from './user-books.controller';
import { UserBooksService } from './user-books.service';
import { UserBooksRepository } from './user-books.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserBook])],
  controllers: [UserBooksController],
  providers: [UserBooksService, UserBooksRepository],
  exports: [UserBooksService, UserBooksRepository],
})
export class UserBooksModule {}
