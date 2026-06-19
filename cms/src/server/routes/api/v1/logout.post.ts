import { defineEventHandler, deleteCookie } from 'h3';

export default defineEventHandler((event) => {
  // Eliminar la cookie
  deleteCookie(event, 'authToken', {
    path: '/',
  });

  return {
    success: true,
  };
});
