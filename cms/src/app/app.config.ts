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
// Para agregar rutas separadas del sistema de archivos
//  withExtraRoutes
} from '@analogjs/router';
import { withComponentInputBinding } from '@angular/router';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { withPrismHighlighter } from '@analogjs/content/prism-highlighter';

// Para agregar rutas separadas del sistema de archivos
// const customRoutes: Routes = [
//   {
//     path: 'custom',
//     loadComponent: () =>
//       import('./custom-component').then((m) => m.CustomComponent),
//   },
// ];

/**
 * La configuración de providers en Angular se hace de forma separada
 * No se utiliza un componente como en React
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Manejo global de errores
    provideBrowserGlobalErrorListeners(),

    // Manejo de rutas basadas en archivos
    provideFileRouter(
      // Inyección de parametros de ruta a los componentes
      withComponentInputBinding(),
      
      // Para desarrollo permite ver la página de: /__analog/routes
      withDebugRoutes(),
      
      // Para agregar rutas separadas del sistema de archivos
      //withExtraRoutes(customRoutes)
    ),

    // Manejo de Peticiones Http
    provideHttpClient(
      // El uso de withFetch está deprecado
      // FetchBackend es el default en Angular ahora
      // withFetch,
      withInterceptors([requestContextInterceptor]),
    ),

    // Hidratación de JavaScript
    provideClientHydration(withEventReplay()),

    // Provee soporte de rutas Markdown
    provideContent(withMarkdownRenderer(), withPrismHighlighter()),
  ],
};
