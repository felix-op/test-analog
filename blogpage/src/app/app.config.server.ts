import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';

import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()], // Rendering del lado del servidor
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

/* RESUMEN:
Cuando AnalogJS genera tu aplicación en el servidor (para enviarle el HTML ya listo al usuario y 
mejorar el SEO/velocidad de carga), no usa solamente app.config.ts, sino que usa app.config.server.ts. 
De esta manera, el servidor tiene todo lo base más las capacidades de renderizado en servidor, 
mientras que el cliente (el navegador) usa solo lo base.
*/ 