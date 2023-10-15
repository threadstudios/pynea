import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/*
 * Error Interceptor
 * A last chance saloon for all the real nasties
 * Our plan is to log out anything bizarro here
 * We return a flat Internal Server Error to users
 */

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          Logger.warn('Handled Error', {
            ...err,
            stack: err.stack,
          });
          return throwError(() => err);
        }
        if (err instanceof Error) {
          Logger.error(err.message, {
            ...err,
            stack: err.stack,
          });
        }
        return throwError(() => new InternalServerErrorException());
      }),
    );
  }
}
