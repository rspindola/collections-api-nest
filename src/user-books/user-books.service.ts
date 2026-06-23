import { Injectable } from '@nestjs/common';
import { UserBooksRepository } from './user-books.repository';
import { UpsertUserBookDto } from './dto/upsert-user-book.dto';
import { UserBook } from './entities/user-book.entity';

@Injectable()
export class UserBooksService {
  constructor(private readonly userBooksRepository: UserBooksRepository) {}

  async upsert(userId: number, dto: UpsertUserBookDto): Promise<UserBook> {
    return this.userBooksRepository.upsert(userId, dto.bookId, {
      hasRead: dto.hasRead,
      haveBought: dto.haveBought,
    });
  }

  async findByUser(userId: number): Promise<UserBook[]> {
    return this.userBooksRepository.findByUser(userId);
  }

  async findOne(userId: number, bookId: number): Promise<Partial<UserBook>> {
    const result = await this.userBooksRepository.findOne(userId, bookId);
    if (result) {
      return result;
    }
    return {
      userId,
      bookId,
      hasRead: false,
      haveBought: false,
    };
  }
}
