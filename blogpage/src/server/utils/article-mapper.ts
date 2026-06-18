export function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export function formatCategory(tags: string[]): string {
  const firstTag = tags[0];
  return firstTag
    ? firstTag.charAt(0).toUpperCase() + firstTag.slice(1)
    : 'Tecnología';
}
