import { defineEventHandler, setCookie } from 'h3';

export default defineEventHandler((event) => {
  const token = process.env['DEV_FALSE_TOKEN'] || 'default_fallback_token';
  
  // Establece la cookie para que el middleware pueda leerla
  setCookie(event, 'authToken', token, {
    httpOnly: false, // Permitimos que el cliente lo lea si quiere, pero igual lo mandamos en el body
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 semana
  });

  return {
    success: true,
    token: token
  };
});
