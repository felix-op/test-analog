export type Block = {
  type: 'header' | 'paragraph' | 'image' | 'list';
  data: Record<string, any>;
};
