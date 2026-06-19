import { defineEventHandler, setHeader } from 'h3';

export default defineEventHandler((event) => {
  const ultimosContenidos = [
    { titulo: 'Nueva funcionalidad Alpha', key: 'funcionalidad-alpha', contenido: 'Explicación...' },
    { titulo: 'Lanzamiento de Módulo 1', key: 'modulo-1', contenido: 'Detalles...' }
  ];

  // 2. Mapeas los contenidos al formato XML estructurado
  const itemsXml = ultimosContenidos.map(item => `
    <item>
      <title>${item.titulo}</title>
      <link>https://tuapp.com/modulo1/${item.key}</link>
      <description>${item.contenido}</description>
    </item>
  `).join('');

  const feedString = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Mi Plataforma Modula</title>
    <link>https://tuapp.com</link>
    <description>Feed oficial de actualizaciones</description>
    ${itemsXml}
  </channel>
</rss>`;

  setHeader(event, 'content-type', 'text/xml');
  return feedString;
});