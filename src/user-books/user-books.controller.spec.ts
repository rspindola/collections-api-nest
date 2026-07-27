import { Test, TestingModule } from '@nestjs/testing';
import { UserBooksController } from './user-books.controller';
import { UserBooksService } from './user-books.service';
import { UpsertUserBookDto } from './dto/upsert-user-book.dto';

describe('UserBooksController', () => {
  let controller: UserBooksController;

  const mockUserBooksService = {
    upsert: jest.fn(),
    findByUser: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBooksController],
      providers: [
        {
          provide: UserBooksService,
          useValue: mockUserBooksService,
        },
      ],
    }).compile();

    controller = module.get<UserBooksController>(UserBooksController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upsert', () => {
    it('should create or update book status for logged in user', async () => {
      const req = { user: { id: 1 } };
      const dto: UpsertUserBookDto = {
        bookId: 2,
        hasRead: true,
        haveBought: false,
      };
      const serviceResult = {
        userId: 1,
        bookId: 2,
        hasRead: true,
        haveBought: false,
      };
      mockUserBooksService.upsert.mockResolvedValue(serviceResult);

      const result = await controller.upsert(req, dto);

      expect(result).toEqual({
        success: true,
        userBook: serviceResult,
        message: 'Successfully updated book status',
      });
      expect(mockUserBooksService.upsert).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('index', () => {
    it('should list all book statuses for current user', async () => {
      const req = { user: { id: 1 } };
      const serviceResult = [{ userId: 1, bookId: 2, hasRead: true }];
      mockUserBooksService.findByUser.mockResolvedValue(serviceResult);

      const result = await controller.index(req);

      expect(result).toEqual({
        success: true,
        userBooks: serviceResult,
        message: 'Successfully listed user book statuses',
      });
      expect(mockUserBooksService.findByUser).toHaveBeenCalledWith(1);
    });
  });

  describe('show', () => {
    it('should get current user status for a specific book', async () => {
      const req = { user: { id: 1 } };
      const serviceResult = {
        userId: 1,
        bookId: 2,
        hasRead: false,
        haveBought: false,
      };
      mockUserBooksService.findOne.mockResolvedValue(serviceResult);

      const result = await controller.show(req, '2');

      expect(result).toEqual({
        success: true,
        userBook: serviceResult,
        message: 'Successfully fetched book status',
      });
      expect(mockUserBooksService.findOne).toHaveBeenCalledWith(1, 2);
    });
  });
});
