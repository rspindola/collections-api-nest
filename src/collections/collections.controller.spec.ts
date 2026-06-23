import { Test, TestingModule } from '@nestjs/testing';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('CollectionsController', () => {
  let controller: CollectionsController;

  const mockCollectionsService = {
    getAll: jest.fn(),
    store: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionsController],
      providers: [
        {
          provide: CollectionsService,
          useValue: mockCollectionsService,
        },
      ],
    }).compile();

    controller = module.get<CollectionsController>(CollectionsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should list all collections', async () => {
      const pagination: PaginationDto = { page: 1, limit: 10 };
      const collectionsResult = {
        data: [{ id: 1, name: 'Collection 1' }],
        meta: { total: 1, page: 1, limit: 10, lastPage: 1 },
      };
      mockCollectionsService.getAll.mockResolvedValue(collectionsResult);

      const result = await controller.index(pagination);

      expect(result).toEqual({
        success: true,
        ...collectionsResult,
        message: 'Successfully listed collections',
      });
      expect(mockCollectionsService.getAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('store', () => {
    it('should store a new collection', async () => {
      const dto: CreateCollectionDto = {
        name: 'New Collection',
        category_id: 1,
      };
      const createdCollection = {
        id: 1,
        name: 'New Collection',
        categoryId: 1,
      };
      mockCollectionsService.store.mockResolvedValue(createdCollection);

      const result = await controller.store(dto);

      expect(result).toEqual({
        success: true,
        collection: createdCollection,
        message: 'Successfully created collection',
      });
      expect(mockCollectionsService.store).toHaveBeenCalledWith(dto);
    });
  });

  describe('show', () => {
    it('should return a collection by id', async () => {
      const collection = { id: 1, name: 'Collection 1' };
      mockCollectionsService.getById.mockResolvedValue(collection);

      const result = await controller.show('1');

      expect(result).toEqual({
        success: true,
        collection,
        message: 'Successfully show collection',
      });
      expect(mockCollectionsService.getById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a collection and return the result', async () => {
      const dto: UpdateCollectionDto = { name: 'Updated Collection' };
      const updatedCollection = { id: 1, name: 'Updated Collection' };
      mockCollectionsService.update.mockResolvedValue(updatedCollection);

      const result = await controller.update('1', dto);

      expect(result).toEqual({
        success: true,
        collection: updatedCollection,
        message: 'Successfully updated collection',
      });
      expect(mockCollectionsService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('destroy', () => {
    it('should delete a collection and return the deleted details', async () => {
      const collection = { id: 1, name: 'Collection 1' };
      mockCollectionsService.getById.mockResolvedValue(collection);
      mockCollectionsService.delete.mockResolvedValue(undefined);

      const result = await controller.destroy('1');

      expect(result).toEqual({
        success: true,
        collection,
        message: 'Successfully delete collection',
      });
      expect(mockCollectionsService.getById).toHaveBeenCalledWith(1);
      expect(mockCollectionsService.delete).toHaveBeenCalledWith(1);
    });
  });
});
