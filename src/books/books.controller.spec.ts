import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('BooksController', () => {
  let controller: BooksController;

  const mockBooksService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    store: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return paginated list of books', async () => {
      const req = { user: { id: 1 } };
      const pagination: PaginationDto = { page: 1, limit: 10 };
      const booksResult = {
        data: [{ id: 1, title: 'Book 1' }],
        meta: { total: 1, page: 1, limit: 10, lastPage: 1 },
      };
      mockBooksService.getAll.mockResolvedValue(booksResult);

      const result = await controller.index(req, pagination);

      expect(result).toEqual({
        success: true,
        ...booksResult,
        message: 'Successfully listed books',
      });
      expect(mockBooksService.getAll).toHaveBeenCalledWith(1, pagination);
    });
  });

  describe('store', () => {
    it('should store book with uploaded file name', async () => {
      const dto = {
        title: 'New Book',
        collection_id: 1,
      } as unknown as CreateBookDto;
      const file = { filename: 'cover_123.jpg' } as Express.Multer.File;
      const bookResult = { id: 1, title: 'New Book', cover: 'cover_123.jpg' };
      mockBooksService.store.mockResolvedValue(bookResult);

      const result = await controller.store(dto, file);

      expect(result).toEqual({
        success: true,
        book: bookResult,
        message: 'Successfully created book',
      });
      expect(mockBooksService.store).toHaveBeenCalledWith(dto, 'cover_123.jpg');
    });

    it('should store book without uploaded file', async () => {
      const dto = {
        title: 'New Book',
        collection_id: 1,
      } as unknown as CreateBookDto;
      const bookResult = { id: 1, title: 'New Book', cover: null };
      mockBooksService.store.mockResolvedValue(bookResult);

      await controller.store(dto, undefined);

      expect(mockBooksService.store).toHaveBeenCalledWith(dto, undefined);
    });
  });

  describe('show', () => {
    it('should return book info', async () => {
      const req = { user: { id: 1 } };
      const book = { id: 1, title: 'Book 1' };
      mockBooksService.getById.mockResolvedValue(book);

      const result = await controller.show(req, '1');

      expect(result).toEqual({
        success: true,
        book,
        message: 'Successfully created show',
      });
      expect(mockBooksService.getById).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('update', () => {
    it('should update book with uploaded file', async () => {
      const dto = { title: 'Updated' } as UpdateBookDto;
      const file = { filename: 'new_cover.jpg' } as Express.Multer.File;
      const updatedBook = { id: 1, title: 'Updated', cover: 'new_cover.jpg' };
      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await controller.update('1', dto, file);

      expect(result).toEqual({
        success: true,
        book: updatedBook,
        message: 'Successfully updated book',
      });
      expect(mockBooksService.update).toHaveBeenCalledWith(
        1,
        dto,
        'new_cover.jpg',
      );
    });

    it('should update book without uploaded file', async () => {
      const dto = { title: 'Updated' } as UpdateBookDto;
      const updatedBook = { id: 1, title: 'Updated', cover: 'old_cover.jpg' };
      mockBooksService.update.mockResolvedValue(updatedBook);

      await controller.update('1', dto, undefined);

      expect(mockBooksService.update).toHaveBeenCalledWith(1, dto, undefined);
    });
  });

  describe('destroy', () => {
    it('should delete a book and return the details', async () => {
      const deletedBook = { id: 1, title: 'Book 1' };
      mockBooksService.delete.mockResolvedValue(deletedBook);

      const result = await controller.destroy('1');

      expect(result).toEqual({
        success: true,
        book: deletedBook,
        message: 'Successfully delete book',
      });
      expect(mockBooksService.delete).toHaveBeenCalledWith(1);
    });
  });
});
