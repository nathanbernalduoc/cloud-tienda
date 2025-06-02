import {
  LogLevel,
  Configuration,
  BrowserCacheLocation,
} from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '9bbb7c44-ba2e-4eb5-beea-a7815ca3a4fd',
    authority: 'https://desarrollocloudnativeduoc.ciamlogin.com/',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false,
    },
  },
};

export const loginRequest = {
  scopes: [],
};
