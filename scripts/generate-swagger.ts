import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { createSwaggerDocument } from '../src/config/swagger.config';
import * as fs from 'fs/promises';
import { resolve } from 'path';

async function generateSwagger() {
  console.log('⏳ Inicializando contexto para geração do swagger.json...');

  const mockRepo = {
    metadata: { columns: [], relations: [] },
    find: async () => [],
    findOne: async () => null,
  };

  // Mock do DataSource para não exigir que o banco MySQL esteja ativo durante o build/geração
  const mockDataSource = {
    isInitialized: true,
    options: { type: 'mysql' },
    entityMetadatas: [],
    destroy: async () => {},
    getRepository: () => mockRepo,
    getTreeRepository: () => mockRepo,
    getMongoRepository: () => mockRepo,
    createQueryBuilder: () => ({
      where: () => ({}),
      andWhere: () => ({}),
      getMany: async () => [],
    }),
  };

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(getDataSourceToken())
    .useValue(mockDataSource)
    .compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  await app.init();

  const document = createSwaggerDocument(app);
  const outputPath = resolve(process.cwd(), 'swagger.json');

  await fs.writeFile(outputPath, JSON.stringify(document, null, 2), 'utf-8');
  await app.close();

  console.log(`✅ Arquivo swagger.json gerado com sucesso em: ${outputPath}`);
}

generateSwagger().catch((error) => {
  console.error('❌ Falha ao gerar swagger.json:', error);
  process.exit(1);
});
