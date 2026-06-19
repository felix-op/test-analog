import {
  provideHttpClient,
  // El uso de withFetch está deprecado
  // FetchBackend es el default en Angular ahora
  // withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  provideFileRouter,
  requestContextInterceptor,
  withDebugRoutes,
//  withExtraRoutes
} from '@analogjs/router';
import { withComponentInputBinding } from '@angular/router';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { withPrismHighlighter } from '@analogjs/content/prism-highlighter';

// const customRoutes: Routes = [
//   {
//     path: 'custom',
//     loadComponent: () =>
//       import('./custom-component').then((m) => m.CustomComponent),
//   },
// ];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFileRouter(
      withComponentInputBinding(),
      withDebugRoutes(),
      //withExtraRoutes(customRoutes)
    ),
    provideHttpClient(
      // El uso de withFetch está deprecado
      // FetchBackend es el default en Angular ahora
      // withFetch,
      withInterceptors([requestContextInterceptor]),
    ),
    provideClientHydration(withEventReplay()),
    // Provee soporte de runtas Markdown
    provideContent(withMarkdownRenderer(), withPrismHighlighter()),
  ],
};
