import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

import { provideFileRouter } from '@analogjs/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Manejo global de errores
    provideFileRouter() // Manejo de rutas basadas en archivos
  ],
};

/* RESUMEN: 
  Todo lo que pongas en app.config.ts estará disponible 
  globalmente en toda tu aplicación, principalmente cuando
  corre en el navegador del usuario. */
/* 
 * RESUMEN DEL ARCHIVO:
 * Este archivo contiene la configuración global de la aplicación (proveedores de servicios, rutas, hidratación).
 * Comparación con Expo: En Expo, el equivalente conceptual sería tu archivo principal donde configuras los "Providers" (como Redux o contextos) y envuelves tu aplicación con el contenedor de navegación (NavigationContainer).
 */
