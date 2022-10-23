import {
  Injectable,
  NestInterceptor,
  NotFoundException,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(tap(data => {
        if (data === undefined) throw new NotFoundException();
      }));
  }
}
