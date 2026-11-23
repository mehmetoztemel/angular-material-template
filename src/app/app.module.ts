import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLoaderComponent } from './app-loader/app-loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from '@angular/common/http';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { AuthGuard } from './shared/guards/auth.guard';
import { AppConfig } from './app.config';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { MessageInterceptor } from './shared/interceptors/message.interceptor';
import { CustomDateAdapter } from './shared/utilities/Utility';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { turkishPaginatorIntl } from './shared/utilities/turkish-paginator';
@NgModule({
  declarations: [AppComponent, AppLoaderComponent],
  imports: [BrowserModule, AppRoutingModule, MatProgressSpinnerModule],
  providers: [
    { provide: MatPaginatorIntl, useFactory: turkishPaginatorIntl },
    provideAnimationsAsync(),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideNativeDateAdapter(),
    AppConfig,
    AuthGuard,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MessageInterceptor,
      multi: true,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'tr-TR',
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
