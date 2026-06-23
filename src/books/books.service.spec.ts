import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BooksRepository } from './repositories/books.repository';
import { ConfigService } from '@nestjs/config';
import { Book } from './entities/book.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import * as fs from 'fs/promises';

jest.mock('fs/promises', () => ({
  unlink: jest.fn().mockResolvedValue(undefined),
}));

describe('BooksService', () => {
  let service: BooksService;

  const mockBooksRepository = {
    findPaginatedWithUserStatus: jest.fn(),
    getByIdWithUserStatus: jest.fn(),
    getById: jest.fn(),
    store: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:3000'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: BooksRepository,
          useValue: mockBooksRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return paginated books formatted with cover and userStatus', async () => {
      const pagination: PaginationDto = { page: 1, limit: 10 };
      const book = {
        id: 1,
        title: 'Book Title',
        cover: 'cover.jpg',
        userBooks: [{ hasRead: true, haveBought: false }],
      } as unknown as Book;

      mockBooksRepository.findPaginatedWithUserStatus.mockResolvedValue([
        [book],
        1,
      ]);

      const result = await service.getAll(1, pagination);

      expect(result.data[0]).toEqual({
        id: 1,
        title: 'Book Title',
        cover: 'http://localhost:3000/storage/cover.jpg',
        userStatus: { hasRead: true, haveBought: false },
      });
      expect(
        mockBooksRepository.findPaginatedWithUserStatus,
      ).toHaveBeenCalledWith(1, 1, 10);
    });

    it('should fallback to default page and limit', async () => {
      mockBooksRepository.findPaginatedWithUserStatus.mockResolvedValue([
        [],
        0,
      ]);

      await service.getAll(1, {});

      expect(
        mockBooksRepository.findPaginatedWithUserStatus,
      ).toHaveBeenCalledWith(1, 1, 15);
    });
  });

  describe('getById', () => {
    it('should return a book formatted with userStatus and cover url', async () => {
      const book = {
        id: 1,
        title: 'Book Title',
        cover: 'http://alreadyexternal.com/cover.jpg',
        userBooks: [],
      } as unknown as Book;

      mockBooksRepository.getByIdWithUserStatus.mockResolvedValue(book);

      const result = await service.getById(1, 1);

      expect(result).toEqual({
        id: 1,
        title: 'Book Title',
        cover: 'http://alreadyexternal.com/cover.jpg',
        userStatus: { hasRead: false, haveBought: false },
      });
      expect(mockBooksRepository.getByIdWithUserStatus).toHaveBeenCalledWith(
        1,
        1,
      );
    });
  });

  describe('store', () => {
    it('should store and format a new book', async () => {
      const dto = {
        title: 'New Book',
        collection_id: 2,
        publishedAt: '2026-01-01',
      };
      const savedBook = {
        id: 5,
        title: 'New Book',
        collectionId: 2,
        cover: 'covers/file.png',
        publishedAt: new Date('2026-01-01'),
        userBooks: [],
      } as unknown as Book;

      mockBooksRepository.store.mockResolvedValue(savedBook);

      const result = await service.store(dto, 'file.png');

      expect(result.title).toBe('New Book');
      expect(mockBooksRepository.store).toHaveBeenCalledWith({
        title: 'New Book',
        collectionId: 2,
        cover: 'covers/file.png',
        publishedAt: new Date('2026-01-01'),
      });
    });
  });

  describe('update', () => {
    it('should update book details and delete old cover if new cover is uploaded', async () => {
      const existingBook = {
        id: 1,
        title: 'Old Title',
        cover: 'covers/old.png',
      } as Book;
      const dto = {
        title: 'Updated Title',
        collection_id: 3,
        publishedAt: '2026-02-02',
      };
      const updatedBook = {
        id: 1,
        title: 'Updated Title',
        collectionId: 3,
        cover: 'covers/new.png',
        publishedAt: new Date('2026-02-02'),
        userBooks: [],
      } as unknown as Book;

      mockBooksRepository.getById.mockResolvedValue(existingBook);
      mockBooksRepository.update.mockResolvedValue(updatedBook);

      const result = await service.update(1, dto, 'new.png');

      expect(fs.unlink).toHaveBeenCalled();
      expect(mockBooksRepository.getById).toHaveBeenCalledWith(1);
      expect(mockBooksRepository.update).toHaveBeenCalledWith(1, {
        title: 'Updated Title',
        collectionId: 3,
        cover: 'covers/new.png',
        publishedAt: new Date('2026-02-02'),
      });
      expect(result.title).toBe('Updated Title');
    });

    it('should update without new cover or publishedAt', async () => {
      const existingBook = { id: 1, title: 'Old Title', cover: null } as Book;
      const dto = { title: 'Updated Title' };
      const updatedBook = {
        id: 1,
        title: 'Updated Title',
        cover: null,
        userBooks: [],
      } as unknown as Book;

      mockBooksRepository.getById.mockResolvedValue(existingBook);
      mockBooksRepository.update.mockResolvedValue(updatedBook);

      await service.update(1, dto);

      expect(fs.unlink).not.toHaveBeenCalled();
      expect(mockBooksRepository.update).toHaveBeenCalledWith(1, {
        title: 'Updated Title',
      });
    });
  });

  describe('delete', () => {
    it('should delete book and unlink cover if it exists', async () => {
      const book = {
        id: 1,
        title: 'To Delete',
        cover: 'covers/delete.jpg',
      } as Book;
      mockBooksRepository.getById.mockResolvedValue(book);
      mockBooksRepository.delete.mockResolvedValue(undefined);

      await service.delete(1);

      expect(fs.unlink).toHaveBeenCalled();
      expect(mockBooksRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should delete book and ignore cover deletion if no cover exists', async () => {
      const book = { id: 1, title: 'To Delete', cover: null } as Book;
      mockBooksRepository.getById.mockResolvedValue(book);
      mockBooksRepository.delete.mockResolvedValue(undefined);

      await service.delete(1);

      expect(fs.unlink).not.toHaveBeenCalled();
      expect(mockBooksRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
