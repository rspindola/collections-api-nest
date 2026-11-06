import { applyDecorators, Type, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiUnauthorizedResponse as SwaggerApiUnauthorizedResponse,
  ApiForbiddenResponse as SwaggerApiForbiddenResponse,
  ApiNotFoundResponse as SwaggerApiNotFoundResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  StandardResponseDto,
  PaginatedResponseDto,
  PaginationMetaDto,
  ErrorResponseDto,
  ValidationErrorResponseDto,
} from './api-response.dto';

interface ApiStandardResponseOptions<TModel extends Type<any>> {
  type?: TModel;
  status?: HttpStatus;
  description?: string;
  dataKey?: string;
  isArray?: boolean;
}

/**
 * Decorator para documentar respostas de sucesso no formato padrão da API.
 * Suporta o envelope padrão com 'data' ou chave personalizada (ex: 'book', 'user', 'collection').
 */
export function ApiStandardResponse<TModel extends Type<any>>(
  options: ApiStandardResponseOptions<TModel> = {},
) {
  const {
    type,
    status = HttpStatus.OK,
    description = 'Operação realizada com sucesso.',
    dataKey = 'data',
    isArray = false,
  } = options;

  if (!type) {
    return applyDecorators(
      ApiExtraModels(StandardResponseDto),
      ApiResponse({
        status,
        description,
        schema: {
          $ref: getSchemaPath(StandardResponseDto),
        },
      }),
    );
  }

  const modelSchema = isArray
    ? {
        type: 'array',
        items: { $ref: getSchemaPath(type) },
      }
    : { $ref: getSchemaPath(type) };

  return applyDecorators(
    ApiExtraModels(StandardResponseDto, type),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(StandardResponseDto) },
          {
            properties: {
              [dataKey]: modelSchema,
            },
          },
        ],
      },
    }),
  );
}

/**
 * Decorator para documentar listagens paginadas no formato padrão da API.
 */
export function ApiPaginatedResponse<TModel extends Type<any>>(
  model: TModel,
  options?: { description?: string },
) {
  return applyDecorators(
    ApiExtraModels(PaginatedResponseDto, PaginationMetaDto, model),
    ApiResponse({
      status: HttpStatus.OK,
      description: options?.description ?? 'Listagem retornada com sucesso.',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
}

/**
 * Decorator para respostas de erro de validação (HTTP 400 ou 422).
 */
export function ApiValidationErrorResponse(
  description = 'Erro de validação nos dados enviados.',
) {
  return applyDecorators(
    ApiExtraModels(ValidationErrorResponseDto),
    ApiResponse({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      description,
      type: ValidationErrorResponseDto,
    }),
  );
}

/**
 * Decorator para resposta de recurso não encontrado (HTTP 404).
 */
export function ApiNotFoundResponse(description = 'Recurso não encontrado.') {
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    SwaggerApiNotFoundResponse({
      description,
      type: ErrorResponseDto,
    }),
  );
}

/**
 * Decorator para erro de autenticação (HTTP 401).
 */
export function ApiAuthUnauthorizedResponse(
  description = 'Não autorizado. Token JWT ausente ou inválido.',
) {
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    SwaggerApiUnauthorizedResponse({
      description,
      type: ErrorResponseDto,
    }),
  );
}

/**
 * Decorator para erro de permissão (HTTP 403).
 */
export function ApiForbiddenAccessResponse(
  description = 'Acesso proibido. Nível de permissão insuficiente (ex: requer admin).',
) {
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    SwaggerApiForbiddenResponse({
      description,
      type: ErrorResponseDto,
    }),
  );
}
