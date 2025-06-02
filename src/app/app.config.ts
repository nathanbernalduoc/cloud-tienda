import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { MsalModule } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

import { msalConfig } from './auth-config';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),

    importProvidersFrom(
      MsalModule.forRoot(
        new PublicClientApplication(msalConfig),
        {
          interactionType: InteractionType.Popup,
        },
        {
          interactionType: InteractionType.Popup,
          protectedResourceMap: new Map<string, Array<string>>()
        }
      )
    ),
  ]
};
