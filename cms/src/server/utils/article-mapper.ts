export function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
}

export function formatCategory(tags: string[]): string {
  const firstTag = tags[0];
  return firstTag
    ? firstTag.charAt(0).toUpperCase() + firstTag.slice(1)
    : 'Tecnología';
}

export function mapArticleSummary(art: any) {
  const tags = normalizeTags(art.tag_list || art.tags);
  const category = formatCategory(tags);
  const date = new Date(art.published_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    id: art.id.toString(),
    title: art.title,
    category,
    tags,
    coverImage:
      art.cover_image ||
      art.social_image ||
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000',
    date,
    author: {
      name: art.user.name,
      avatar:
        art.user.profile_image ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(art.user.name)}`,
    },
    likes: art.public_reactions_count || 0,
    commentsCount: art.comments_count || 0,
    shares: Math.floor((art.public_reactions_count || 0) * 0.8),
    blocks: [],
    comments: [],
  };
}
