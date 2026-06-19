import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = query['page'] ? parseInt(query['page'] as string, 10) : 1;
  const perPage = query['per_page'] ? parseInt(query['per_page'] as string, 10) : 10;

  const base = process.env['API_URL'];
  if (!base) throw new Error("API_URL no está definida en las variables de entorno");

  const response = await fetch(`${base}/tags?page=${page}&per_page=${perPage}`);
  if (!response.ok) {
    throw new Error(`Error al consultar tags: ${response.status}`);
  }

  const tags: any[] = await response.json();
  return tags.map((t: any) => {
    const name: string = t.name || "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  });
});
