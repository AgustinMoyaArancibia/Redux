import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { providers } from './api/providers/providers';
import { routes } from './app.routes';

import { effects } from './store/effects/index.effects';
import { reducers } from './store/store';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MessageService } from 'primeng/api';   
import { provideAnimations } from '@angular/platform-browser/animations';
import { requestInterceptor } from './core/interceptors/request.interceptor';
export const appConfig: ApplicationConfig = {

  providers: [
    ...providers,provideAnimations(),
    provideRouter(routes),
    provideClientHydration(),   MessageService,
    provideStore(reducers),
    provideEffects(effects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
     provideHttpClient(
      withInterceptors([requestInterceptor]),
      withFetch(),withXsrfConfiguration({
    cookieName: 'XSRF-TOKEN',
    headerName: 'X-XSRF-TOKEN',
    
  }),

       withInterceptors([requestInterceptor])   // <-- solo interceptores acá
    ),
  ]
};
