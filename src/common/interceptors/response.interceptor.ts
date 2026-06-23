import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

/**
 * Transforma toda resposta de sucesso para o formato padronizado:
 * { success: true, data: <result>, message: <message> }
 *
 * Equivalente ao BaseController::sendResponse() do Laravel.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // Se o controller já retornou no formato padronizado, passa direto
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
        return {
          success: true,
          data,
          message: 'Operation completed successfully',
        };
      }),
    );
  }
}
