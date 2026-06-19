import { defineEventHandler, EventHandlerRequest, getRequestURL, H3Event, parseCookies, sendRedirect, createError } from 'h3';

type EventoMiddleware = H3Event<EventHandlerRequest>;

function exactUrl(event: EventoMiddleware, url: string): boolean {
    return event.node.req.originalUrl === url;
}

function filterUrls(event: EventoMiddleware, url: string): boolean {
    return getRequestURL(event).pathname.startsWith(url);
}

// Verficar que esté autenticado
export default defineEventHandler(async (event) => {
  // Verificamos protección para el editor de artículos
  if (filterUrls(event, '/blog/article-editor')) {
    const cookies = parseCookies(event);
    const isLoggedIn = cookies['authToken'];

    if (!isLoggedIn) {
      // Rebotar con 404 lanzando un error en lugar de retornar
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found'
      });
    }
  }

  // Dejamos la protección existente para admin intacta, si es necesaria
  if (filterUrls(event, '/admin')) {
    const cookies = parseCookies(event);
    const isLoggedIn = cookies['authToken'];

    if (!isLoggedIn) {
      await sendRedirect(event, '/login', 401);
    }
  }
});
