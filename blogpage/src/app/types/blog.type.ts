export type EditorJsBlock = {
  id?: string;
  type: 'paragraph' | 'header' | 'list' | 'image' | string;
  data: {
    text?: string;
    level?: number;
    style?: 'ordered' | 'unordered';
    items?: string[];
    file?: {
      url: string;
    };
    caption?: string;
    withBorder?: boolean;
    withBackground?: boolean;
    stretched?: boolean;
  };
};

export type Comment = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
};

export type Article = {
  id: string;
  title: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  commentsCount: number;
  shares: number;
  blocks: EditorJsBlock[];
  comments?: Comment[];
};