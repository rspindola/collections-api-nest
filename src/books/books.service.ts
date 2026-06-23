import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BooksRepository } from './repositories/books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class BooksService {
  constructor(
    private readonly booksRepository: BooksRepository,
    private readonly configService: ConfigService,
  ) {}

  private formatBookCover(book: Book): Book {
    if (book && book.cover) {
      const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');
      // If it doesn't already have http, prefix it with the asset storage path
      if (!book.cover.startsWith('http')) {
        book.cover = `${appUrl}/storage/${book.cover}`;
      }
    }
    return book;
  }

  private formatBook(book: Book): any {
    if (!book) return book;
    const formatted = this.formatBookCover(book);
    const userBook = book.userBooks && book.userBooks.length > 0 ? book.userBooks[0] : null;
    const userStatus = userBook
      ? { hasRead: userBook.hasRead, haveBought: userBook.haveBought }
      : { hasRead: false, haveBought: false };

    const { userBooks, ...rest } = formatted as any;
    return {
      ...rest,
      userStatus,
    };
  }

  private async deleteCoverFile(coverPath: string) {
    if (!coverPath) return;
    try {
      // coverPath in db is stored as 'covers/filename.ext'
      // physical path is 'uploads/covers/filename.ext'
      const fullPath = join(process.cwd(), 'uploads', coverPath);
      await fs.unlink(fullPath);
    } catch (error) {
      // File might not exist or already be deleted, ignore error
    }
  }

  async getAll(userId: number, pagination: PaginationDto): Promise<PaginatedResult<any>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 15;
    const [data, total] = await this.booksRepository.findPaginatedWithUserStatus(userId, page, limit);

    return {
      data: data.map((book) => this.formatBook(book)),
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number, userId: number): Promise<any> {
    const book = await this.booksRepository.getByIdWithUserStatus(id, userId);
    return this.formatBook(book);
  }

  async store(dto: CreateBookDto, coverFilename?: string): Promise<any> {
    const { collection_id, publishedAt, ...rest } = dto;
    const coverPath = coverFilename ? `covers/${coverFilename}` : null;
    const publishedAtDate = publishedAt ? new Date(publishedAt) : null;

    const book = await this.booksRepository.store({
      ...rest,
      collectionId: collection_id,
      cover: coverPath,
      publishedAt: publishedAtDate,
    });

    return this.formatBook(book);
  }

  async update(id: number, dto: UpdateBookDto, newCoverFilename?: string): Promise<any> {
    const book = await this.booksRepository.getById(id);
    const { collection_id, publishedAt, ...rest } = dto;

    const updateData: any = { ...rest };
    if (collection_id !== undefined) {
      updateData.collectionId = collection_id;
    }

    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    }

    if (newCoverFilename) {
      // Delete old cover if exists
      if (book.cover) {
        await this.deleteCoverFile(book.cover);
      }
      updateData.cover = `covers/${newCoverFilename}`;
    }

    const updatedBook = await this.booksRepository.update(id, updateData);
    return this.formatBook(updatedBook);
  }

  async delete(id: number): Promise<any> {
    const book = await this.booksRepository.getById(id);
    if (book.cover) {
      await this.deleteCoverFile(book.cover);
    }
    await this.booksRepository.delete(id);
    return this.formatBook(book);
  }
}
