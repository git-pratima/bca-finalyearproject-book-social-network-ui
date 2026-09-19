import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {TokenService} from '../token/token.service';
import { LoadingService } from '../loading/loading.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadingService.start();
    const token = this.tokenService.token;
    const isAuthenticationRequest = request.url.includes('/auth/');
    const requestToSend = token && !isAuthenticationRequest
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : request;

    return next.handle(requestToSend).pipe(
      catchError((error) => {
        if ((error.status === 401 || error.status === 403) && !isAuthenticationRequest) {
          this.tokenService.clear();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.stop())
    );
  }
}
