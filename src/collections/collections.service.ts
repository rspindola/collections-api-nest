import { Injectable } from '@nestjs/common';
import { CollectionsRepository } from './repositories/collections.repository';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class CollectionsService {
  constructor(private readonly collectionsRepository: CollectionsRepository) {}

  async getAll(pagination: PaginationDto): Promise<PaginatedResult<any>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 15;
    const [data, total] = await this.collectionsRepository.findPaginated(
      page,
      limit,
    );

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number) {
    return this.collectionsRepository.getById(id);
  }

  async store(dto: CreateCollectionDto) {
    const { category_id, ...rest } = dto;
    return this.collectionsRepository.store({
      ...rest,
      categoryId: category_id,
    });
  }

  async update(id: number, dto: UpdateCollectionDto) {
    const { category_id, ...rest } = dto;
    const updateData: any = { ...rest };
    if (category_id !== undefined) {
      updateData.categoryId = category_id;
    }
    return this.collectionsRepository.update(id, updateData);
  }

  async delete(id: number) {
    return this.collectionsRepository.delete(id);
  }
}
