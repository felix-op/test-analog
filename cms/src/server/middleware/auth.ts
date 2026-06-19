import { defineEventHandler, EventHandlerRequest, getRequestURL, H3Event, parseCookies, sendRedirect, setHeaders } from 'h3';

type EventoMiddleware = H3Event<EventHandlerRequest>;

function exactUrl(event: EventoMiddleware, url: string): boolean {
    return event.node.req.originalUrl === url;
}

function filterUrls(event: EventoMiddleware, url: string): boolean {
    return getRequestURL(event).pathname.startsWith(url);
}

// Devolver headers
// export default defineEventHandler((event) => {
//   if (exactUrl(event, '/checkout')) {
//     console.log('event url', event.node.req.originalUrl);

//     setHeaders(event, {
//       'x-analog-checkout': 'true',
//     });
//   }
// });

// Verficar que esté autenticado
export default defineEventHandler(async (event) => {
  if (filterUrls(event, '/admin')) {
    const cookies = parseCookies(event);
    const isLoggedIn = cookies['authToken'];

    if (!isLoggedIn) {
      sendRedirect(event, '/login', 401);
    }
  }
});

