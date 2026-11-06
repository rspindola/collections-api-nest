import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';

export function buildSwaggerConfig() {
  return new DocumentBuilder()
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
}

export function createSwaggerDocument(app: INestApplication): OpenAPIObject {
  const config = buildSwaggerConfig();
  return SwaggerModule.createDocument(app, config);
}
