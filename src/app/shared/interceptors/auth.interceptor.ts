import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('Token');
        if (token != null) {
            const clonereq = request.clone({
                headers: request.headers.set("Authorization", "Bearer " + token)
            });

            // request = request.clone({
            //     setHeaders: { Authorization: `Bearer ${token}` }
            // });
            
            return next.handle(clonereq);
        }
        else {
            return next.handle(request);
        }
    }
}