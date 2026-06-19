import { createError, defineEventHandler, getRouterParam } from "h3";
import { formatCategory, normalizeTags } from "../../../../utils/article-mapper";

const URL_BASE = process.env["API_URL"] || "";

function parseMarkdownToBlocks(markdown: string): any[] {
  if (!markdown) return [];

  const blocks: any[] = [];
  for (const chunk of markdown.split(/\n\s*\n/)) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("#")) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/s);
      if (match) {
        blocks.push({
          type: "header",
          data: { text: match[2].replace(/[\*\_]/g, ""), level: Math.min(match[1].length, 3) },
        });
        continue;
      }
    }

    if (trimmed.startsWith("![") && trimmed.includes("](")) {
      const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/s);
      if (match) {
        blocks.push({
          type: "image",
          data: { file: { url: match[2] }, caption: match[1] || "Imagen del artículo", withBorder: false, withBackground: false, stretched: false },
        });
        continue;
      }
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s+/.test(trimmed)) {
      const isOrdered = /^\d+\.\s+/.test(trimmed);
      const items = trimmed.split("\n").map((l) => {
        const t = l.trim();
        return isOrdered ? t.replace(/^\d+\.\s+/, "").replace(/[\*\_]/g, "") : t.replace(/^[\-\*]\s+/, "").replace(/[\*\_]/g, "");
      }).filter(Boolean);
      blocks.push({ type: "list", data: { style: isOrdered ? "ordered" : "unordered", items } });
      continue;
    }

    let text = trimmed
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/_([^_]+)_/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline font-medium">$1</a>');
    if (text.startsWith("```")) text = text.replace(/```[a-zA-Z]*/g, "").trim();
    blocks.push({ type: "paragraph", data: { text } });
  }

  return blocks;
}

export default defineEventHandler(async (event) => {
  const articleId = getRouterParam(event, "articleId");

  if (!articleId) {
    throw createError({
      statusCode: 400,
      message: "ID del artículo no proveído",
    });
  }

  const id = parseInt(articleId ? articleId : "");

  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID del artítulo debe ser entero",
    });
  }

  let articles = null;
  try {
    const articleResponse = await fetch(`${URL_BASE}/articles/${id}`);

    if (!articleResponse.ok) {
      throw createError({
        statusCode: 404,
        statusMessage: `No se encontró el artículo buscado ${id}`,
      });
    }

    articles = await articleResponse.json();
  } catch (error) {
    throw error;
  }

  let comments: any[] = [];
  try {
    const commentsResponse = await fetch(`${URL_BASE}/comments?a_id=${id}`, {
      headers: { Accept: "application/vnd.forem.api-v1+json" },
    });
    if (commentsResponse.ok) {
      const raw = await commentsResponse.json();
      comments = raw.map((c: any) => ({
        id: c.id_code,
        author: c.user.name,
        avatar:
          c.user.profile_image ||
          `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(c.user.name)}`,
        text: c.body_html.replace(/<[^>]*>/g, "").trim(),
        date: new Date(c.created_at).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      }));
    }
  } catch (e) {
    console.warn("No se pudieron recuperar los comentarios:", e);
  }

  const tags = normalizeTags(articles.tag_list || articles.tags);
  const category = formatCategory(tags);

  return {
    id: articles.id.toString(),
    title: articles.title,
    category,
    tags,
    coverImage:
      articles.cover_image ||
      articles.social_image ||
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000",
    date: new Date(articles.published_at).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    author: {
      name: articles.user.name,
      avatar:
        articles.user.profile_image ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(articles.user.name)}`,
    },
    likes: articles.public_reactions_count || 0,
    commentsCount: comments.length || articles.comments_count || 0,
    shares: Math.floor((articles.public_reactions_count || 0) * 0.8),
    blocks: parseMarkdownToBlocks(articles.body_markdown),
    comments,
  };
});
