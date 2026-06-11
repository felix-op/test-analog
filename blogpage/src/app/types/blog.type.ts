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
/* 
 * RESUMEN DEL ARCHIVO:
 * Este archivo define los "tipos" o la estructura de datos que usamos para los artículos mediante TypeScript.
 * Asegura que todos los artículos tengan los campos correctos (título, contenido, categoría, etc.).
 * Comparación con Expo: En Expo (si usas TypeScript), tendrías un archivo similar con "interfaces" o "types" para autocompletado y validación de datos. Si usas JavaScript puro, no tendrías este archivo, pero correrías más riesgo de errores.
 */
