import { Injectable, signal } from '@angular/core';
import { Article, Comment } from '../types/blog.type';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private articlesSignal = signal<Article[]>([]);
  articles = this.articlesSignal.asReadonly();

  // Caché separada de detalles completos (no modifica el listado principal)
  private detailCache = new Map<string, Article>();

  // Estados de paginación reactivos (Signals)
  private currentPageSignal = signal<number>(1);
  currentPage = this.currentPageSignal.asReadonly();

  private hasMoreSignal = signal<boolean>(true);
  hasMore = this.hasMoreSignal.asReadonly();

  private loadingSignal = signal<boolean>(false);
  loading = this.loadingSignal.asReadonly();

  // ─── Categorías / Tags dinámicos desde la API ───
  private categoriesSignal = signal<string[]>([]);
  categories = this.categoriesSignal.asReadonly();

  private categoriesPageSignal = signal<number>(1);
  categoriesPage = this.categoriesPageSignal.asReadonly();

  private hasMoreCategoriesSignal = signal<boolean>(true);
  hasMoreCategories = this.hasMoreCategoriesSignal.asReadonly();

  private loadingCategoriesSignal = signal<boolean>(false);
  loadingCategories = this.loadingCategoriesSignal.asReadonly();

  // Tag activo para filtrar artículos (null = sin filtro)
  private activeTagSignal = signal<string | null>(null);
  activeTag = this.activeTagSignal.asReadonly();

  constructor() {
    this.cargarArticulos(1);
    this.cargarCategorias(1);
  }

  // ─── Carga de categorías (tags) desde la API ───
  cargarCategorias(page: number = 1) {
    if (typeof window === 'undefined') return;

    this.loadingCategoriesSignal.set(true);

    fetch(`/api/tags?page=${page}&per_page=10`)
      .then(res => res.json())
      .then((tags: string[]) => {
        if (Array.isArray(tags)) {
          if (tags.length < 10) {
            this.hasMoreCategoriesSignal.set(false);
          } else {
            this.hasMoreCategoriesSignal.set(true);
          }

          if (page === 1) {
            this.categoriesSignal.set(tags);
          } else {
            this.categoriesSignal.update(current => [...current, ...tags]);
          }

          this.categoriesPageSignal.set(page);
        }
        this.loadingCategoriesSignal.set(false);
      })
      .catch(err => {
        console.error('Error al cargar categorías de la API:', err);
        this.loadingCategoriesSignal.set(false);
      });
  }

  // Carga las siguientes 10 categorías
  cargarMasCategorias() {
    if (this.loadingCategoriesSignal() || !this.hasMoreCategoriesSignal()) return;
    const nextPage = this.categoriesPageSignal() + 1;
    this.cargarCategorias(nextPage);
  }

  // Activa un filtro por tag y recarga artículos desde la API filtrados
  filtrarPorTag(tag: string | null) {
    this.activeTagSignal.set(tag);
    this.currentPageSignal.set(1);
    this.hasMoreSignal.set(true);
    this.articlesSignal.set([]);
    this.cargarArticulos(1, tag);
  }

  // Carga artículos desde la API de Nitro (10 por página, con filtro opcional por tag)
  cargarArticulos(page: number = 1, tag?: string | null) {
    if (typeof window === 'undefined') return;

    this.loadingSignal.set(true);

    // Usamos el tag activo si no se pasa explícitamente
    const activeTag = tag !== undefined ? tag : this.activeTagSignal();
    let url = `/api/articles?page=${page}&per_page=10`;
    if (activeTag) {
      url += `&tag=${encodeURIComponent(activeTag.toLowerCase())}`;
    }

    fetch(url)
      .then(res => res.json())
      .then((remoteArticles: Article[]) => {
        if (Array.isArray(remoteArticles)) {
          // Si traemos menos de 10 elementos, significa que no hay más artículos en el servidor
          if (remoteArticles.length < 10) {
            this.hasMoreSignal.set(false);
          } else {
            this.hasMoreSignal.set(true);
          }

          if (page === 1) {
            this.articlesSignal.set(remoteArticles);
          } else {
            this.articlesSignal.update(current => [...current, ...remoteArticles]);
          }

          this.currentPageSignal.set(page);
        }
        this.loadingSignal.set(false);
      })
      .catch(err => {
        console.error('Error al cargar artículos de la API:', err);
        this.loadingSignal.set(false);
      });
  }

  // Carga la siguiente página de artículos (respetando el filtro activo)
  cargarMasArticulos() {
    if (this.loadingSignal() || !this.hasMoreSignal()) return;
    const nextPage = this.currentPageSignal() + 1;
    this.cargarArticulos(nextPage);
  }

  // Retorna el artículo que está en la señal (útil para carga rápida instantánea)
  obtenerArticuloPorId(id: string): Article | undefined {
    return this.articlesSignal().find(a => a.id === id);
  }

  // Obtiene los detalles completos (bloques y comentarios) de la API de forma asíncrona
  // Usa una caché separada para no modificar el listado principal y evitar re-renders
  async obtenerDetalleArticulo(id: string): Promise<Article> {
    // Si ya tenemos el detalle cacheado, lo devolvemos al instante
    const cached = this.detailCache.get(id);
    if (cached) {
      return cached;
    }

    const response = await fetch(`/api/articles/${id}`);
    if (!response.ok) {
      throw new Error(`No se pudo cargar el detalle para el artículo con ID: ${id}`);
    }
    const freshArticle: Article = await response.json();

    // Guardamos en la caché separada (NO tocamos articlesSignal)
    this.detailCache.set(id, freshArticle);

    return freshArticle;
  }

  // Guarda un artículo creado/editado en memoria (estado de sesión)
  guardarArticulo(articulo: Article) {
    const current = this.articlesSignal();
    const index = current.findIndex(a => a.id === articulo.id);
    if (index !== -1) {
      const updated = [...current];
      updated[index] = { ...updated[index], ...articulo };
      this.articlesSignal.set(updated);
    } else {
      this.articlesSignal.update(currentList => [articulo, ...currentList]);
    }
  }

  // Oculta/Elimina un artículo de la vista en memoria
  eliminarArticulo(id: string) {
    const filtradosMemoria = this.articlesSignal().filter(a => a.id !== id);
    this.articlesSignal.set(filtradosMemoria);
  }

  // Incrementa el me gusta reactivamente en memoria para la sesión actual
  darMeGusta(id: string) {
    const actualizados = this.articlesSignal().map(articulo => {
      if (articulo.id === id) {
        return { ...articulo, likes: (articulo.likes || 0) + 1 };
      }
      return articulo;
    });
    this.articlesSignal.set(actualizados);
  }

  // Incrementa los compartidos reactivamente en memoria
  compartirArticulo(id: string) {
    const actualizados = this.articlesSignal().map(articulo => {
      if (articulo.id === id) {
        return { ...articulo, shares: (articulo.shares || 0) + 1 };
      }
      return articulo;
    });
    this.articlesSignal.set(actualizados);
  }

  // Agrega un comentario al artículo correspondiente en la sesión actual
  agregarComentario(articuloId: string, autor: string, texto: string) {
    const actualizados = this.articlesSignal().map(articulo => {
      if (articulo.id === articuloId) {
        const comentarios = articulo.comments || [];
        const nuevoComentario: Comment = {
          id: Date.now().toString(),
          author: autor,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(autor)}`,
          text: texto,
          date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
        const nuevosComentarios = [nuevoComentario, ...comentarios];
        return {
          ...articulo,
          comments: nuevosComentarios,
          commentsCount: nuevosComentarios.length
        };
      }
      return articulo;
    });
    
    this.articlesSignal.set(actualizados);
  }

  // Recomendador de artículos relacionados por similitud de etiquetas/categorías
  obtenerArticulosRelacionados(articulo: Article, limite = 3): Article[] {
    return this.articlesSignal()
      .filter(a => a.id !== articulo.id)
      .map(a => {
        let coincidencia = 0;
        if (a.category === articulo.category) coincidencia += 5;
        if (a.tags && articulo.tags) {
          const coincidenciasTags = a.tags.filter(t => articulo.tags?.includes(t)).length;
          coincidencia += coincidenciasTags * 2;
        }
        return { articulo: a, coincidencia };
      })
      .filter(item => item.coincidencia > 0)
      .sort((a, b) => b.coincidencia - a.coincidencia)
      .map(item => item.articulo)
      .slice(0, limite);
  }
}
