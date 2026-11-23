import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private appConfig: AppConfig) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('Token');
    // Authorization belongs to the application API, not map/address providers.
    if (token != null && request.url.startsWith(this.appConfig.ApiUrl)) {
      const clonereq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
      });

      // request = request.clone({
      //     setHeaders: { Authorization: `Bearer ${token}` }
      // });

      return next.handle(clonereq);
    } else {
      return next.handle(request);
    }
  }
}
