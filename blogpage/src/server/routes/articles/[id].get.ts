import { defineEventHandler, getRouterParam } from 'h3';

// Función para parsear Markdown básico a bloques estructurados compatibles con Editor.js
function parseMarkdownToBlocks(markdown: string): any[] {
  if (!markdown) return [];
  
  // Dividimos por doble salto de línea para aislar los bloques principales (párrafos, headers, listas, imágenes)
  const chunks = markdown.split(/\n\s*\n/);
  const blocks: any[] = [];

  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    // 1. Encabezados (Headers: #, ##, ###)
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/s);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[\*\_]/g, ''); // Limpiar asteriscos/guiones bajos
        blocks.push({
          type: 'header',
          data: {
            text,
            level: Math.min(level, 3) // Forzamos nivel 1 a 3 para consistencia visual
          }
        });
        continue;
      }
    }

    // 2. Imágenes (![Alt](URL))
    if (trimmed.startsWith('![') && trimmed.includes('](')) {
      const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/s);
      if (match) {
        const caption = match[1];
        const url = match[2];
        blocks.push({
          type: 'image',
          data: {
            file: { url },
            caption: caption || 'Imagen del artículo',
            withBorder: false,
            withBackground: false,
            stretched: false
          }
        });
        continue;
      }
    }

    // 3. Listas (Viñetas de tipo - , * o 1. )
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s+/.test(trimmed)) {
      const isOrdered = /^\d+\.\s+/.test(trimmed);
      const lines = trimmed.split('\n');
      const items = lines.map(line => {
        const lineTrimmed = line.trim();
        if (isOrdered) {
          return lineTrimmed.replace(/^\d+\.\s+/, '').replace(/[\*\_]/g, '');
        } else {
          return lineTrimmed.replace(/^[\-\*]\s+/, '').replace(/[\*\_]/g, '');
        }
      }).filter(Boolean);

      blocks.push({
        type: 'list',
        data: {
          style: isOrdered ? 'ordered' : 'unordered',
          items
        }
      });
      continue;
    }

    // 4. Párrafos (Default)
    // Traducimos formatos simples de Markdown inline a HTML seguro para Angular binding [innerHTML]
    let text = trimmed
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Mapea links markdown [texto](url) a enlaces HTML reales
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline font-medium">$1</a>');

    // Descartamos bloques de código muy grandes para no romper la estética del blog simple
    if (text.startsWith('```')) {
      text = text.replace(/```[a-zA-Z]*/g, '').trim();
    }

    blocks.push({
      type: 'paragraph',
      data: { text }
    });
  }

  return blocks;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    return { error: true, message: 'ID del artículo no proveído' };
  }

  try {
    // 1. Obtenemos el detalle del artículo desde DEV.to (contiene el body_markdown)
    const articleResponse = await fetch(`https://dev.to/api/articles/${id}`);
    if (!articleResponse.ok) {
      throw new Error(`Artículo no encontrado en DEV.to (ID: ${id})`);
    }
    const devToArticle = await articleResponse.json();

    // 2. Obtenemos los comentarios asociados al artículo
    let comments: any[] = [];
    try {
      const commentsResponse = await fetch(`https://dev.to/api/comments?a_id=${id}`, {
        headers: {
          'Accept': 'application/vnd.forem.api-v1+json'
        }
      });
      if (commentsResponse.ok) {
        const devToComments = await commentsResponse.json();
        // Mapeamos los comentarios
        comments = devToComments.map((c: any) => {
          const text = c.body_html.replace(/<[^>]*>/g, '').trim(); // Limpiamos HTML para texto plano
          const date = new Date(c.created_at).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          return {
            id: c.id_code,
            author: c.user.name,
            avatar: c.user.profile_image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(c.user.name)}`,
            text,
            date
          };
        });
      }
    } catch (e) {
      console.warn('No se pudieron recuperar los comentarios de DEV.to:', e);
    }

    // 3. Mapeamos la categoría e información básica
    const firstTag = devToArticle.tag_list && devToArticle.tag_list[0];
    const category = firstTag 
      ? firstTag.charAt(0).toUpperCase() + firstTag.slice(1) 
      : 'Tecnología';

    const date = new Date(devToArticle.published_at).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // 4. Convertimos el cuerpo de markdown a bloques de EditorJS
    const blocks = parseMarkdownToBlocks(devToArticle.body_markdown);

    const article = {
      id: devToArticle.id.toString(),
      title: devToArticle.title,
      category,
      tags: devToArticle.tag_list || [],
      coverImage: devToArticle.cover_image || devToArticle.social_image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000',
      date,
      author: {
        name: devToArticle.user.name,
        avatar: devToArticle.user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(devToArticle.user.name)}`
      },
      likes: devToArticle.public_reactions_count || 0,
      commentsCount: comments.length || devToArticle.comments_count || 0,
      shares: Math.floor((devToArticle.public_reactions_count || 0) * 0.8),
      blocks,
      comments
    };

    return article;
  } catch (error: any) {
    console.error(`Error en GET /api/articles/${id}:`, error);
    return {
      error: true,
      message: error.message || 'Error al obtener el detalle del artículo'
    };
  }
});
