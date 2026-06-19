import { defineEventHandler, readBody } from 'h3';
import { randomUUID } from 'node:crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // TODO: persistir en base de datos local
  return { id: randomUUID(), ...body };
});
