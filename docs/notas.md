# Vite
Vite se encarga sólo del desarrollo frontend.
- Levanta un servidor con HRM (Hot Reload Module) y ESM (Ecmascript Module) nativo.
- Compila los componentes Angular, procesa los archivos css/sass, resuelve imágenes y empaqueta el código de forma optimizada.

# Nitro
Se encarga del servidor de backend en producción.
- Maneja la carpeta src/serve, procesa APIs, rutas HTTP y middlewares.
- Ejecuta el SSR tomando el HTML generado por Angular y lo escupe al cliente.
- Permite desplegar de forma sencilla en entornos serverless o edge (Vercel, Netlify, Cloudflare Workers, Docker).

# Middlewares
Los middlewares son funciones que se ejecuta antes de responder la petición.
Analog soporta middleware del lado del servidor. Y puede servir para:

- Modificar solicitudes: filtrar o transformar datos.
- Seguridad: Verficar autenticación y autorización.
- Redigir y más.

Nitro lee los middleware en orden. Conviene enumerarlos para controlar el flujo.

Utilizan `defineEventHandler` y no devuelven nada.

# APIs
Para servir datos de la aplicación se pueden definir rutas en src/server/routes. También utiliza el sistema de ficheros y se exponen por la ruta /api

También utilizan `defineEventHandler` y pero sí devuelven algo.
Soporta tanto JSON como XML para RSS (Really Simple Syndication). Para este ultimo hay que modicar algo extra.

- Rutas estáticas: `/server/routes/api/v1/hello.ts`
- Rutas dinámicas: `/server/routes/api/v1/hello/[name].ts`
- Contenido XML: `/server/routes/api/v1/rss.xml.ts`

# Peticiones HTTP
Para consumir las APIs se utilizan los mismos conceptos que en Angular (`HttpClient`).

La documentación oficial de Analog dice que hay que copiar un bloque corto de código en `main.server.ts` y proveer `provideServerContext` pero no hace falta, esto se simplifica con el código:
```js
import '@angular/platform-server/init';
import { render } from '@analogjs/router/server';

...
export default render(App, config);
```

# RSS
Un feed RSS (Really Simple Syndication) es un formato estandarizado basado en XML que se utiliza para difundir y compartir contenido web de forma automatizada.

En lugar de que un usuario tenga que entrar a tu página web todos los días para ver si has publicado algo nuevo, el usuario se suscribe al feed RSS (usando un lector de feeds como Feedly). Cada vez que publicas un artículo, sección o archivo en tu plataforma, el archivo rss.xml se actualiza y los suscriptores reciben la notificación instantáneamente.

# Generación de código
Se puede utilizar tanto Nx como Schematics para generar código repetitivo.
Ejemplo: Crear una página.

- Crear una nueva app en analog con un espacio de trabajo:
```bash
npx ng generate @analogjs/platform:application my-app
```
- Crear una página:
```bash
npx ng g @analogjs/platform:page --pathname=index --project=/
npx ng g @analogjs/platform:page --pathname='products/[products]' --project=/
```