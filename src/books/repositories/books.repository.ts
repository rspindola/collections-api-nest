import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';

@Injectable()
export class BooksRepository {
  constructor(
    @InjectRepository(Book)
    private readonly repo: Repository<Book>,
  ) {}

  async getAll(): Promise<Book[]> {
    return this.repo.find();
  }

  async findPaginatedWithUserStatus(
    userId: number,
    page: number,
    limit: number,
  ): Promise<[Book[], number]> {
    const qb = this.repo.createQueryBuilder('book');

    qb.leftJoinAndSelect(
      'book.userBooks',
      'userBook',
      'userBook.userId = :userId',
      { userId },
    )
      .orderBy('book.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    return qb.getManyAndCount();
  }

  async getById(id: number): Promise<Book> {
    const book = await this.repo.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async getByIdWithUserStatus(id: number, userId: number): Promise<Book> {
    const qb = this.repo.createQueryBuilder('book');

    qb.leftJoinAndSelect(
      'book.userBooks',
      'userBook',
      'userBook.userId = :userId',
      { userId },
    ).where('book.id = :id', { id });

    const book = await qb.getOne();
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async store(data: Partial<Book>): Promise<Book> {
    const book = this.repo.create(data);
    return this.repo.save(book);
  }

  async update(id: number, data: Partial<Book>): Promise<Book> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
