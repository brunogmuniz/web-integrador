import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { LoginService } from 'app-core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly injector: Injector) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    const oauthService = this.injector.get(OAuthService);
    const accessToken = oauthService.getAccessToken();

    if (accessToken && !request.headers.has('Authorization')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          const loginService = this.injector.get(LoginService);
          loginService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
