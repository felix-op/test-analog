import { createError, defineEventHandler, getRouterParam, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const articleId = getRouterParam(event, "articleId");
  if (!articleId) {
    throw createError({ statusCode: 400, statusMessage: "ID del artículo no provisto" });
  }

  const body = await readBody(event);

  // TODO: persistir en base de datos local
  return { id: articleId, ...body };
});
