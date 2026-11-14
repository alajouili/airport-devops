import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

// French date and number formats ("jeu. 30/10", "1 250,00 €").
registerLocaleData(localeFr);

/**
 * Global configuration of the application: the "providers" are the
 * services and features available everywhere.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding: a route parameter like :id is given to the page as an input.
    provideRouter(routes, withComponentInputBinding()),
    // HttpClient = the service that sends requests to Spring Boot.
    // Interceptors run in this order for each request.
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
};
