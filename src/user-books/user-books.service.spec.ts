import { Test, TestingModule } from '@nestjs/testing';
import { UserBooksService } from './user-books.service';
import { UserBooksRepository } from './user-books.repository';
import { UpsertUserBookDto } from './dto/upsert-user-book.dto';
import { UserBook } from './entities/user-book.entity';

describe('UserBooksService', () => {
  let service: UserBooksService;

  const mockUserBooksRepository = {
    upsert: jest.fn(),
    findByUser: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserBooksService,
        {
          provide: UserBooksRepository,
          useValue: mockUserBooksRepository,
        },
      ],
    }).compile();

    service = module.get<UserBooksService>(UserBooksService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsert', () => {
    it('should call repository upsert and return the result', async () => {
      const dto: UpsertUserBookDto = {
        bookId: 2,
        hasRead: true,
        haveBought: false,
      };
      const expectedResult = {
        userId: 1,
        bookId: 2,
        hasRead: true,
        haveBought: false,
      } as UserBook;

      mockUserBooksRepository.upsert.mockResolvedValue(expectedResult);

      const result = await service.upsert(1, dto);

      expect(result).toEqual(expectedResult);
      expect(mockUserBooksRepository.upsert).toHaveBeenCalledWith(1, 2, {
        hasRead: true,
        haveBought: false,
      });
    });
  });

  describe('findByUser', () => {
    it('should find all user books for the user', async () => {
      const expectedResult = [{ userId: 1, bookId: 2 }] as UserBook[];
      mockUserBooksRepository.findByUser.mockResolvedValue(expectedResult);

      const result = await service.findByUser(1);

      expect(result).toEqual(expectedResult);
      expect(mockUserBooksRepository.findByUser).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return found user book', async () => {
      const expectedResult = {
        userId: 1,
        bookId: 2,
        hasRead: true,
        haveBought: true,
      } as UserBook;
      mockUserBooksRepository.findOne.mockResolvedValue(expectedResult);

      const result = await service.findOne(1, 2);

      expect(result).toEqual(expectedResult);
      expect(mockUserBooksRepository.findOne).toHaveBeenCalledWith(1, 2);
    });

    it('should return a default user book object if not found', async () => {
      mockUserBooksRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(1, 2);

      expect(result).toEqual({
        userId: 1,
        bookId: 2,
        hasRead: false,
        haveBought: false,
      });
      expect(mockUserBooksRepository.findOne).toHaveBeenCalledWith(1, 2);
    });
  });
});
