import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig);

/* 
 * RESUMEN DEL ARCHIVO:
 * Este es el archivo de arranque (entry point) principal para el navegador. Toma tu aplicación (App) y la inicializa (bootstrap) en la página web HTML (donde encuentra la etiqueta <app-root>).
 * Comparación con Expo: En Expo o React Native, este sería el archivo `index.js` en la raíz de tu proyecto, que llama a `registerRootComponent(App)` para decirle al teléfono "Aquí arranca mi aplicación".
 */
