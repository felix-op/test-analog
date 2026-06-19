import { createError, defineEventHandler, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const articleId = getRouterParam(event, 'articleId');
  const id = parseInt(articleId ? articleId : '');
  console.log("Viene la petición? ", articleId);
  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    });
  }
  return { value: `Hello, ${articleId}!` };
});
