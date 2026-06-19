import '@angular/platform-server/init';
import { render } from '@analogjs/router/server';

import { App } from './app/app';
import { config } from './app/app.config.server';

export default render(App, config);

/*
    Inicializa la app en el servidor
    SSR o SSG 
*/
