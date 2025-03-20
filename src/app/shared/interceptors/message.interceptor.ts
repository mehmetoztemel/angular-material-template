import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IResult } from '../models/result';
import { LoaderService } from '../services/loader.service';
import { MessageService } from '../services/message.service';

@Injectable({
    providedIn: 'root'
})
export class MessageInterceptor implements HttpInterceptor {
    constructor(private messageService: MessageService, private route: Router, private loaderService: LoaderService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.show();

        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    let result = event.body as IResult;
                    // Success Messages
                    if (result.IsSuccess && req.method === 'POST' && !req.url.includes("auth/login")) {
                        this.messageService.openSnackBar("Kayıt Başarıyla Eklendi", "success-snackbar");
                    }
                    if (result.IsSuccess && req.method === 'PUT') {
                        this.messageService.openSnackBar("Kayıt Başarıyla Güncellendi", "success-snackbar");
                    }
                    if (result.IsSuccess && req.method === 'DELETE') {
                        this.messageService.openSnackBar("Kayıt Başarıyla Silindi", "success-snackbar");
                    }
                    // Error Messages
                    if (!result.IsSuccess) {
                        this.messageService.openSnackBar(result.ErrorMessages.join(', '), "error-snackbar");
                    }

                    this.loaderService.hide();
                    return event;
                }
            }),
            catchError((error: HttpErrorResponse) => {
                this.loaderService.hide();
                if (error.status === 401) {
                    this.messageService.openSnackBar("Token süresi dolmuştur", "error-snackbar");
                    localStorage.removeItem('Token');
                    this.route.navigateByUrl('/auth/login');
                } else {
                    if (error.error?.ErrorMessages != undefined || null) {
                        this.messageService.openSnackBar(error.error?.ErrorMessages.join(', '), "error-snackbar");
                    } else {
                        console.error('Beklenmeyen bir hata:', error);
                        this.messageService.openSnackBar(error.message, "error-snackbar");
                    }
                }
                return throwError(() => new Error(`Hata: ${error.message}`));
            })
        );
    }
}