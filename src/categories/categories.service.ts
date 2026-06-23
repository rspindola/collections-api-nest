import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './repositories/categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getAll(pagination: PaginationDto): Promise<PaginatedResult<any>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 15;
    const [data, total] = await this.categoriesRepository.findPaginated(
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
    return this.categoriesRepository.getById(id);
  }

  async store(dto: CreateCategoryDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });
    return this.categoriesRepository.store({
      name: dto.name,
      slug,
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const updateData: any = {};
    if (dto.name) {
      updateData.name = dto.name;
      updateData.slug = slugify(dto.name, { lower: true, strict: true });
    }
    return this.categoriesRepository.update(id, updateData);
  }

  async delete(id: number) {
    return this.categoriesRepository.delete(id);
  }
}
