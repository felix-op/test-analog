export type ParagraphBlock = {
  id: string;
  type: 'paragraph';
  text: string;
};

export type HeadingBlock = {
  id: string;
  type: 'heading';
  text: string;
  level: 1 | 2 | 3;
};

export type ImageBlock = {
  id: string;
  type: 'image';
  url: string;
};

export type BlogBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock;

export type Article = {
  id: string;
  title: string;
  blocks: BlogBlock[];
};