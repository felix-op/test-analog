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