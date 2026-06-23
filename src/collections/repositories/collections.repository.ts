import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from '../entities/collection.entity';

@Injectable()
export class CollectionsRepository {
  constructor(
    @InjectRepository(Collection)
    private readonly repo: Repository<Collection>,
  ) {}

  async getAll(): Promise<Collection[]> {
    return this.repo.find();
  }

  async findPaginated(page: number, limit: number): Promise<[Collection[], number]> {
    return this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
      relations: { category: true },
    });
  }

  async getById(id: number): Promise<Collection> {
    const collection = await this.repo.findOne({
      where: { id },
      relations: { books: true },
    });
    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }
    return collection;
  }

  async store(data: Partial<Collection>): Promise<Collection> {
    const collection = this.repo.create(data);
    return this.repo.save(collection);
  }

  async update(id: number, data: Partial<Collection>): Promise<Collection> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
