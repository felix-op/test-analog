# Explicación de la Integración del Backend y Comparativa con Expo (React Native)

Este documento detalla el trabajo realizado para conectar la **BlogPage** hecha en AnalogJS con la API pública de **DEV.to**, explica el funcionamiento del backend en Nitro y contrasta esta arquitectura con el desarrollo backend en el ecosistema móvil de **Expo**.

---

## 1. ¿Qué se implementó en este Backend?

Hemos dotado a nuestra aplicación web de capacidades **fullstack reales**, migrando de una persistencia local estática (`localStorage` con mocks) a una integración dinámica con la API pública y gratuita de **DEV.to**. 

Para lograrlo de la manera más limpia y óptima, diseñamos una arquitectura **BFF (Backend-For-Frontend)** utilizando **Vite y Nitro**:

### A. Endpoints Proxy en Nitro (`src/server/routes/`)
Nitro es el motor de servidor ultrarrápido integrado en AnalogJS. Creamos dos enrutadores del lado del servidor:
1.  **Listado (`GET /api/articles`)** ([articles.get.ts](file:///Users/aldanabiondi/Documents/Pablo%20Donato/UNIVERSIDAD/TALLER/Taller%20DEMO/test-analog/blogpage/src/server/routes/articles.get.ts)): 
    *   Consulta la API de DEV.to (`https://dev.to/api/articles?per_page=30`).
    *   Mapea y estandariza los campos externos (como `public_reactions_count` a `likes`, y `user` a `author`) para que coincidan con nuestro modelo de TypeScript `Article`.
    *   Formatea la fecha de publicación al español.
2.  **Detalle (`GET /api/articles/:id`)** ([id.get.ts](file:///Users/aldanabiondi/Documents/Pablo%20Donato/UNIVERSIDAD/TALLER/Taller%20DEMO/test-analog/blogpage/src/server/routes/articles/%5Bid%5D.get.ts)): 
    *   Consulta el artículo por su ID para obtener el contenido completo del cuerpo.
    *   Realiza una llamada paralela para traer los comentarios del artículo desde `https://dev.to/api/comments?a_id=ID`.

### B. Parser Inteligente de Markdown a Bloques de EditorJS
La API de DEV.to devuelve el contenido completo en texto plano con formato Markdown (`body_markdown`). Sin embargo, nuestra interfaz gráfica (`BlogRenderComponent`) espera un arreglo de bloques estructurados JSON (estilo Editor.js).
*   **La Solución:** Escribimos un parser en el backend que segmenta el Markdown por bloques y los traduce a objetos de bloques compatibles:
    *   `# Título` $\rightarrow$ Bloques tipo `header` (niveles 1, 2, 3).
    *   `![Alt](URL)` $\rightarrow$ Bloques tipo `image` con su leyenda (caption).
    *   `- Item` o `1. Item` $\rightarrow$ Bloques tipo `list` (ordenadas o desordenadas).
    *   Texto plano $\rightarrow$ Bloques tipo `paragraph` traduciendo formatos en línea (`**negrita**` $\rightarrow$ `<strong>`, `[enlace](url)` $\rightarrow$ `<a href="...">`).
*   **Beneficio DX:** Esto permitió conectar la API externa **sin alterar una sola línea de código de los componentes visuales del frontend**, manteniendo las animaciones y el diseño premium intacto.

### C. Consumo Asíncrono Híbrido en Angular (`BlogService`)
*   Al abrir el blog, el frontend hace `fetch('/api/articles')` y carga los artículos remotos, mezclándolos de forma transparente con los artículos creados localmente por el usuario en su navegador.
*   Al abrir un post, `index.page.ts` muestra instantáneamente el título y portada (que ya tiene en memoria) y, de forma asíncrona en segundo plano, descarga y renderiza el cuerpo y los comentarios del artículo. Esto elimina pantallas de carga tediosas.

---

## 2. Comparación de este Backend con uno de Expo (React Native)

Trabajar el backend y consumo de APIs en **AnalogJS (Web Fullstack)** versus **Expo (Móvil Híbrido)** presenta diferencias fundamentales en seguridad, enrutamiento, renderizado y distribución de red:

| Característica | AnalogJS / Nitro (Este Proyecto) | Expo / React Native |
| :--- | :--- | :--- |
| **Arquitectura de Servidor** | **Fullstack Nativo.** El backend (Nitro) y el frontend (Angular) viven y se compilan juntos en el mismo proyecto. | **Client-Side Principal.** Expo es principalmente una app de cliente. El backend suele ser un servicio separado (Express, Firebase, etc.). |
| **CORS (Cross-Origin Resource Sharing)** | **Protegido.** Los navegadores bloquean peticiones directas a dominios ajenos. Usamos Nitro como un **Proxy BFF** para evitar CORS de manera transparente. | **Inexistente.** Las apps móviles nativas no corren en navegadores, por lo que **no sufren de restricciones CORS** y pueden llamar a cualquier API directa. |
| **Seguridad de API Keys** | **Alta.** Las llamadas sensibles y tokens se ejecutan en el servidor Nitro, por lo que las credenciales nunca viajan al navegador del cliente. | **Vulnerable.** Al hacer llamadas directas desde el código de Expo, cualquier API Key guardada en variables de entorno `.env` puede ser extraída descompilando la app. |
| **Tratamiento y Renderizado de Datos** | **Óptimo y Rápido.** El parser traduce Markdown a HTML limpio, el cual es renderizado de forma nativa e instantánea por el motor del navegador web. | **Costoso.** Los celulares no interpretan HTML/CSS. Hay que usar librerías en JS que conviertan cada etiqueta HTML en componentes nativos `<Text>` o `<View>`. |
| **Enrutamiento del Backend** | **Basado en Filesystem.** Nitro mapea automáticamente carpetas a endpoints de API (ej: `routes/articles.ts` se vuelve `/api/articles`). | **API Routes en Expo Router.** Recientemente Expo incorporó rutas de API en desarrollo, pero requiere adaptadores específicos y Node para producción. |
| **Despliegue (Hosting/Deploy)** | **Serverless / Edge.** Nitro compila a JS plano ejecutable en Vercel, Netlify, Cloudflare Workers o Docker con un click. | **App Stores / Cloud.** El frontend se compila a un binario (`.apk`/`.ipa`) para tiendas de apps; el backend debe desplegarse por separado en la nube. |

### Explicación Sencilla de la Diferencia de CORS y BFF
Si tu aplicación web en Angular intentara llamar directamente a `https://dev.to/api/articles`, el navegador web del usuario lo bloquearía inmediatamente por políticas de seguridad (CORS), ya que tu web corre en `http://localhost:5173` y DEV.to está en otro servidor.

*   **En AnalogJS (Nitro):** Creamos una "puerta trasera". El navegador llama a tu propio servidor local (`/api/articles`). Tu servidor Nitro (que corre en Node y no tiene las limitaciones del navegador) hace la petición a DEV.to de servidor a servidor, obtiene los datos, los formatea y se los devuelve limpios al navegador. A esto se le llama patrón **BFF (Backend For Frontend)**.
*   **En Expo:** Como la app corre compilada directamente sobre iOS o Android (sin navegador), el sistema operativo le permite conectarse directamente a DEV.to sin problemas de CORS. Sin embargo, si la API de DEV.to requiriera un token secreto de pago, ponerlo en Expo sería un riesgo de seguridad de nivel crítico (cualquiera podría hackear tu app y robar el token), mientras que ponerlo en Nitro es 100% seguro.
