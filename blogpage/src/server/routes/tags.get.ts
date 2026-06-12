import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const perPage = query.per_page ? parseInt(query.per_page as string, 10) : 10;

    const response = await fetch(`https://dev.to/api/tags?page=${page}&per_page=${perPage}`);
    if (!response.ok) {
      throw new Error(`Error al consultar tags de DEV.to: ${response.status}`);
    }

    const tags: any[] = await response.json();

    // Retornamos solo los nombres de los tags con la primera letra en mayúscula
    const tagNames = tags.map((t: any) => {
      const name = t.name || '';
      return name.charAt(0).toUpperCase() + name.slice(1);
    });

    return tagNames;
  } catch (error: any) {
    console.error('Error en GET /api/tags:', error);
    return [];
  }
});
