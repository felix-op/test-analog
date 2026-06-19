import { defineEventHandler, getQuery } from 'h3';
import { mapArticleSummary } from '../../../utils/article-mapper';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = query['page'] ? parseInt(query['page'] as string, 10) : 1;
  const perPage = query['per_page'] ? parseInt(query['per_page'] as string, 10) : 10;
  const tag = query['tag'] ? (query['tag'] as string).toLowerCase() : '';

  const base = process.env['API_URL'];
  if (!base) throw new Error('API_URL no está definida en las variables de entorno');
  const apiUrl = new URL(`${base}/articles`);
  apiUrl.searchParams.set('page', String(page));
  apiUrl.searchParams.set('per_page', String(perPage));
  if (tag) apiUrl.searchParams.set('tag', tag);

  const response = await fetch(apiUrl.toString());
  if (!response.ok) {
    throw new Error(`Error al consultar la API: ${response.status} ${response.statusText}`);
  }

  const devToArticles: any[] = await response.json();
  return devToArticles.map(mapArticleSummary);
});
