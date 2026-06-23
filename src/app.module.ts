import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { CollectionsModule } from './collections/collections.module';
import { BooksModule } from './books/books.module';
import { UserBooksModule } from './user-books/user-books.module';

import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    // Configuração de variáveis de ambiente (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, jwtConfig],
    }),

    // TypeORM com MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host', 'localhost'),
        port: configService.get<number>('database.port', 3306),
        username: configService.get<string>('database.username', 'root'),
        password: configService.get<string>('database.password', ''),
        database: configService.get<string>(
          'database.database',
          'collections_db',
        ),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
        charset: 'utf8mb4',
        timezone: 'Z',
      }),
      inject: [ConfigService],
    }),

    // Servir arquivos estáticos (uploads de cover)
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/storage',
    }),

    // Módulos da aplicação
    UsersModule,
    AuthModule,
    CategoriesModule,
    CollectionsModule,
    BooksModule,
    UserBooksModule,
  ],
})
export class AppModule {}
