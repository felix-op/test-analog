import '@angular/platform-server/init';
import { render } from '@analogjs/router/server';

import { App } from './app/app';
import { config } from './app/app.config.server';

export default render(App, config);

/* 
 * RESUMEN DEL ARCHIVO:
 * Cumple la misma función de arranque que main.ts, pero se ejecuta del lado del Servidor (Server-Side Rendering). Pre-renderiza la página web para que al usuario le cargue más rápido la primera vez.
 * Comparación con Expo: Expo por defecto compila directamente para el celular, pero si usaras Expo Web con SSR, tendrías un script especial para iniciar la aplicación desde Node.js en vez de en el navegador.
 */
