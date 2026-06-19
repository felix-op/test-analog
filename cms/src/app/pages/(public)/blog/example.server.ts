import { PageServerLoad } from '@analogjs/router';

export const load = async ({
  params, // params/queryParams de la solicitud
  req, // Solicitud H3
  res, // Manejador de Respuesta H3
  fetch, // fetch interno para llamadas API directas,
  event, // evento de solicitud completo
}: PageServerLoad) => {
  return {
    loaded: true,
    contenido: "Cargado correctamente!",
  };
};