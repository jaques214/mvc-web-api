import { ApplicationConfig } from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import { provideNativeDateAdapter } from '@angular/material/core';

import { JwtInterceptorService } from "@services/jwt-interceptor.service";
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true},
  ]
};
