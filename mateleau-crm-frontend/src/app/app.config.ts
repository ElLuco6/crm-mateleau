import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),provideHttpClient(),{provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},{ provide: LOCALE_ID, useValue: 'fr-FR' },],
};
