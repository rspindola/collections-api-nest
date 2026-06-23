import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { CollectionsRepository } from './repositories/collections.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  controllers: [CollectionsController],
  providers: [CollectionsService, CollectionsRepository],
  exports: [CollectionsService, CollectionsRepository],
})
export class CollectionsModule {}
