import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createSwaggerDocument } from './config/swagger.config';
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
  const document = createSwaggerDocument(app);
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
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application running on port ${port}`);
  console.log(`📚 Swagger docs available at /api/docs`);
}

bootstrap().catch((err) => {
  console.error('❌ Fatal error during application bootstrap:', err);
  process.exit(1);
});
