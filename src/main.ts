import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global /api
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors();

  // Validação global (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Resposta padronizada (equivalente ao BaseController do Laravel)
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Collections API')
    .setDescription(
      `API RESTful para gerenciamento de coleções e catálogo de livros (quadrinhos, mangás e livros).\n\n` +
        `### Autenticação\n` +
        `A maioria dos endpoints requer autenticação via **Bearer Token (JWT)**. Para autenticar:\n` +
        `1. Obtenha o token através do endpoint \`POST /api/auth/login\` ou \`POST /api/auth/register\`.\n` +
        `2. Clique no botão **Authorize** no topo desta página e insira seu token.\n\n` +
        `### Formato de Resposta Padronizado\n` +
        `- **Sucesso:** \`{ success: true, data: ..., message: "..." }\`\n` +
        `- **Listagens Paginadas:** \`{ success: true, data: [...], meta: { total, page, limit, lastPage }, message: "..." }\`\n` +
        `- **Erros:** \`{ success: false, message: "...", data: ... }\``,
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Insira o token JWT gerado no login.',
    })
    .addTag(
      'Auth',
      'Autenticação de usuários, login, registro e encerramento de sessão.',
    )
    .addTag(
      'Categories',
      'Categorias temáticas para agrupar coleções (ex: Mangá, HQ, Livro).',
    )
    .addTag(
      'Collections',
      'Séries e coleções de livros (ex: Dragon Ball, Harry Potter).',
    )
    .addTag(
      'Books',
      'Catálogo de livros, volumes individuais e upload de capas.',
    )
    .addTag(
      'User Books',
      'Gerenciamento dos livros pertencentes ao usuário logado.',
    )
    .addTag('Users', 'Consulta e gerenciamento de usuários do sistema.')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      displayRequestDuration: true,
    },
    customSiteTitle: 'Collections API - Documentação Swagger',
  });

  const port = process.env.PORT ?? process.env.APP_PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

void bootstrap();
