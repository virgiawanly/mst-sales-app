import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { AuthService } from '../services/auth.service';

@Injectable()
export class FormatErrorInterceptor implements HttpInterceptor {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _toastController: ToastController
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: any) => {
        const formattedError: HttpFormattedErrorResponse = {
          error: true,
          message: '',
          errors: [],
        };

        if (error.error instanceof ErrorEvent) {
          formattedError.message = 'Something went wrong. Please try again.';
        } else {
          if (error.status === 401 && req.headers.get('Authorization')) {
            this.handleUnauthorized();
          }

          formattedError.status = error.status;
          formattedError.errors = error.error?.errors || [];
          formattedError.message =
            error.error?.message || error.error_message || error.message || 'Something went wrong. Please try again.';
        }

        return throwError(() => formattedError);
      })
    );
  }

  handleUnauthorized() {
    this._authService.logout().subscribe(() => {
      this._toastController
        .create({
          message: 'Your session has expired. Please login again.',
          duration: 3000,
          position: 'bottom',
        })
        .then((toast) => {
          toast.present();
          this._router.navigate(['/auth/login']);
        });
    });
  }
}

export const formatErrorInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: FormatErrorInterceptor, multi: true },
];
