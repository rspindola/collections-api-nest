import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBook } from './entities/user-book.entity';

@Injectable()
export class UserBooksRepository {
  constructor(
    @InjectRepository(UserBook)
    private readonly repo: Repository<UserBook>,
  ) {}

  async upsert(
    userId: number,
    bookId: number,
    data: { hasRead?: boolean; haveBought?: boolean },
  ): Promise<UserBook> {
    let userBook = await this.repo.findOne({ where: { userId, bookId } });
    if (userBook) {
      if (data.hasRead !== undefined) userBook.hasRead = data.hasRead;
      if (data.haveBought !== undefined) userBook.haveBought = data.haveBought;
    } else {
      userBook = this.repo.create({
        userId,
        bookId,
        hasRead: data.hasRead ?? false,
        haveBought: data.haveBought ?? false,
      });
    }
    return this.repo.save(userBook);
  }

  async findByUser(userId: number): Promise<UserBook[]> {
    return this.repo.find({
      where: { userId },
      relations: { book: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(userId: number, bookId: number): Promise<UserBook | null> {
    return this.repo.findOne({ where: { userId, bookId } });
  }
}
