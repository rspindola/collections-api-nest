import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockCategoriesRepository = {
    findPaginated: jest.fn(),
    getById: jest.fn(),
    store: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a paginated list of categories', async () => {
      const pagination: PaginationDto = { page: 1, limit: 10 };
      const categories = [{ id: 1, name: 'Fiction', slug: 'fiction' }];
      mockCategoriesRepository.findPaginated.mockResolvedValue([categories, 1]);

      const result = await service.getAll(pagination);

      expect(result).toEqual({
        data: categories,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          lastPage: 1,
        },
      });
      expect(mockCategoriesRepository.findPaginated).toHaveBeenCalledWith(
        1,
        10,
      );
    });

    it('should use default page and limit if not provided', async () => {
      const pagination: PaginationDto = {};
      mockCategoriesRepository.findPaginated.mockResolvedValue([[], 0]);

      const result = await service.getAll(pagination);

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(15);
      expect(mockCategoriesRepository.findPaginated).toHaveBeenCalledWith(
        1,
        15,
      );
    });
  });

  describe('getById', () => {
    it('should return a category by id', async () => {
      const category = { id: 1, name: 'Fiction', slug: 'fiction' };
      mockCategoriesRepository.getById.mockResolvedValue(category);

      const result = await service.getById(1);

      expect(result).toEqual(category);
      expect(mockCategoriesRepository.getById).toHaveBeenCalledWith(1);
    });
  });

  describe('store', () => {
    it('should slugify and store a new category', async () => {
      const dto = { name: 'Science Fiction' };
      const savedCategory = {
        id: 1,
        name: 'Science Fiction',
        slug: 'science-fiction',
      };
      mockCategoriesRepository.store.mockResolvedValue(savedCategory);

      const result = await service.store(dto);

      expect(result).toEqual(savedCategory);
      expect(mockCategoriesRepository.store).toHaveBeenCalledWith({
        name: 'Science Fiction',
        slug: 'science-fiction',
      });
    });
  });

  describe('update', () => {
    it('should slugify and update category name', async () => {
      const dto = { name: 'New Sci-Fi' };
      const updatedCategory = { id: 1, name: 'New Sci-Fi', slug: 'new-sci-fi' };
      mockCategoriesRepository.update.mockResolvedValue(updatedCategory);

      const result = await service.update(1, dto);

      expect(result).toEqual(updatedCategory);
      expect(mockCategoriesRepository.update).toHaveBeenCalledWith(1, {
        name: 'New Sci-Fi',
        slug: 'new-sci-fi',
      });
    });

    it('should call update with empty data if no name is provided', async () => {
      mockCategoriesRepository.update.mockResolvedValue({
        id: 1,
        name: 'Fiction',
        slug: 'fiction',
      });

      await service.update(1, {});

      expect(mockCategoriesRepository.update).toHaveBeenCalledWith(1, {});
    });
  });

  describe('delete', () => {
    it('should delete a category by id', async () => {
      mockCategoriesRepository.delete.mockResolvedValue(undefined);

      await service.delete(1);

      expect(mockCategoriesRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
