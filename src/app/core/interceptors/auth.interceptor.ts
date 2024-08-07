import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _storageService: StorageService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this._storageService.get(environment.api_token_identifier)).pipe(
      switchMap((token) => {
        if (token && req.withCredentials) {
          const headers = req.headers.append('Authorization', `Bearer ${token}`);
          req = req.clone({ headers, withCredentials: false });
        } else {
          req = req.clone({ withCredentials: false });
        }

        return next.handle(req).pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
          })
        );
      })
    );
  }
}

export const authInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
