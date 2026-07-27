import { Test, TestingModule } from '@nestjs/testing';
import { CollectionsService } from './collections.service';
import { CollectionsRepository } from './repositories/collections.repository';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('CollectionsService', () => {
  let service: CollectionsService;

  const mockCollectionsRepository = {
    findPaginated: jest.fn(),
    getById: jest.fn(),
    store: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionsService,
        {
          provide: CollectionsRepository,
          useValue: mockCollectionsRepository,
        },
      ],
    }).compile();

    service = module.get<CollectionsService>(CollectionsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return paginated collections', async () => {
      const pagination: PaginationDto = { page: 1, limit: 10 };
      const collections = [{ id: 1, name: 'My Collection' }];
      mockCollectionsRepository.findPaginated.mockResolvedValue([
        collections,
        1,
      ]);

      const result = await service.getAll(pagination);

      expect(result).toEqual({
        data: collections,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          lastPage: 1,
        },
      });
      expect(mockCollectionsRepository.findPaginated).toHaveBeenCalledWith(
        1,
        10,
      );
    });

    it('should use default page and limit if not provided', async () => {
      const pagination: PaginationDto = {};
      mockCollectionsRepository.findPaginated.mockResolvedValue([[], 0]);

      const result = await service.getAll(pagination);

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(15);
      expect(mockCollectionsRepository.findPaginated).toHaveBeenCalledWith(
        1,
        15,
      );
    });
  });

  describe('getById', () => {
    it('should return a collection by id', async () => {
      const collection = { id: 1, name: 'My Collection' };
      mockCollectionsRepository.getById.mockResolvedValue(collection);

      const result = await service.getById(1);

      expect(result).toEqual(collection);
      expect(mockCollectionsRepository.getById).toHaveBeenCalledWith(1);
    });
  });

  describe('store', () => {
    it('should store a new collection mapping category_id to categoryId', async () => {
      const dto = { name: 'My Collection', category_id: 2 };
      const savedCollection = { id: 1, name: 'My Collection', categoryId: 2 };
      mockCollectionsRepository.store.mockResolvedValue(savedCollection);

      const result = await service.store(dto);

      expect(result).toEqual(savedCollection);
      expect(mockCollectionsRepository.store).toHaveBeenCalledWith({
        name: 'My Collection',
        categoryId: 2,
      });
    });
  });

  describe('update', () => {
    it('should update a collection mapping category_id if provided', async () => {
      const dto = { name: 'New Name', category_id: 3 };
      const updatedCollection = { id: 1, name: 'New Name', categoryId: 3 };
      mockCollectionsRepository.update.mockResolvedValue(updatedCollection);

      const result = await service.update(1, dto);

      expect(result).toEqual(updatedCollection);
      expect(mockCollectionsRepository.update).toHaveBeenCalledWith(1, {
        name: 'New Name',
        categoryId: 3,
      });
    });

    it('should update a collection without categoryId if category_id is undefined', async () => {
      const dto = { name: 'New Name' };
      const updatedCollection = { id: 1, name: 'New Name' };
      mockCollectionsRepository.update.mockResolvedValue(updatedCollection);

      const result = await service.update(1, dto);

      expect(result).toEqual(updatedCollection);
      expect(mockCollectionsRepository.update).toHaveBeenCalledWith(1, {
        name: 'New Name',
      });
    });
  });

  describe('delete', () => {
    it('should delete a collection by id', async () => {
      mockCollectionsRepository.delete.mockResolvedValue(undefined);

      await service.delete(1);

      expect(mockCollectionsRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
