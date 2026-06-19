import type { Block } from './block.model';
import type { Comment } from './comment.model';

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
  blocks?: Block[];
  comments?: Comment[];
};
