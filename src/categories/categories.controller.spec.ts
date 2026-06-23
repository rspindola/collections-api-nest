import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const mockCategoriesService = {
    getAll: jest.fn(),
    store: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should list all categories', async () => {
      const pagination: PaginationDto = { page: 1, limit: 10 };
      const categoriesResult = {
        data: [{ id: 1, name: 'Fiction', slug: 'fiction' }],
        meta: { total: 1, page: 1, limit: 10, lastPage: 1 },
      };
      mockCategoriesService.getAll.mockResolvedValue(categoriesResult);

      const result = await controller.index(pagination);

      expect(result).toEqual({
        success: true,
        ...categoriesResult,
        message: 'Successfully listed categories',
      });
      expect(mockCategoriesService.getAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('store', () => {
    it('should store a new category', async () => {
      const dto: CreateCategoryDto = { name: 'Fiction' };
      const createdCategory = { id: 1, name: 'Fiction', slug: 'fiction' };
      mockCategoriesService.store.mockResolvedValue(createdCategory);

      const result = await controller.store(dto);

      expect(result).toEqual({
        success: true,
        category: createdCategory,
        message: 'Successfully created category',
      });
      expect(mockCategoriesService.store).toHaveBeenCalledWith(dto);
    });
  });

  describe('show', () => {
    it('should return a category by id', async () => {
      const category = { id: 1, name: 'Fiction', slug: 'fiction' };
      mockCategoriesService.getById.mockResolvedValue(category);

      const result = await controller.show('1');

      expect(result).toEqual({
        success: true,
        category,
        message: 'Successfully show category',
      });
      expect(mockCategoriesService.getById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a category and return the result', async () => {
      const dto: UpdateCategoryDto = { name: 'New Fiction' };
      const updatedCategory = {
        id: 1,
        name: 'New Fiction',
        slug: 'new-fiction',
      };
      mockCategoriesService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update('1', dto);

      expect(result).toEqual({
        success: true,
        category: updatedCategory,
        message: 'Successfully updated category',
      });
      expect(mockCategoriesService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('destroy', () => {
    it('should delete a category and return the deleted category details', async () => {
      const category = { id: 1, name: 'Fiction', slug: 'fiction' };
      mockCategoriesService.getById.mockResolvedValue(category);
      mockCategoriesService.delete.mockResolvedValue(undefined);

      const result = await controller.destroy('1');

      expect(result).toEqual({
        success: true,
        category,
        message: 'Successfully delete category',
      });
      expect(mockCategoriesService.getById).toHaveBeenCalledWith(1);
      expect(mockCategoriesService.delete).toHaveBeenCalledWith(1);
    });
  });
});
