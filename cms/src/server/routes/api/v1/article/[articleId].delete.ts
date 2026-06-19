import { createError, defineEventHandler, getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  const articleId = getRouterParam(event, "articleId");
  if (!articleId) {
    throw createError({ statusCode: 400, statusMessage: "ID del artículo no provisto" });
  }

  // TODO: eliminar de base de datos local
  return { deleted: true, id: articleId };
});
