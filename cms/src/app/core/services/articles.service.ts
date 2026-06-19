import { inject, Injectable, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, shareReplay, tap } from "rxjs";
import { Article } from "@models/article.model";

@Injectable({ providedIn: "root" })
export class ArticlesService {
  private readonly http = inject(HttpClient);

  private readonly _allArticles = signal<Article[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _currentPage = signal<number>(1);
  private readonly _activeTag = signal<string>("");
  private readonly _searchQuery = signal<string>("");
  private readonly _favorites = signal<Set<string>>(new Set());

  private readonly pageSize = 12;

  readonly loading = this._loading.asReadonly();
  readonly activeTag = this._activeTag.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  
  readonly favorites = computed(() => {
    const favIds = this._favorites();
    return this._allArticles().filter(a => favIds.has(a.id));
  });

  // Para compatibilidad donde se requieran todos (por si acaso)
  readonly articles = this._allArticles.asReadonly();

  // 1. Filtrar la lista maestra por tag y query
  readonly filteredArticles = computed(() => {
    const all = this._allArticles();
    const tag = (this._activeTag() ?? '').toLowerCase();
    const query = (this._searchQuery() ?? '').toLowerCase().trim();

    return all.filter((a) => {
      console.log("Que es esto: ", a.tags);
      const matchTag = tag ? a.tags?.map(t => t?.toLowerCase() ?? '').includes(tag) : true;
      const matchQuery = query 
        ? (a.title?.toLowerCase() ?? '').includes(query) || (a.tags && a.tags.some(t => (t?.toLowerCase() ?? '').includes(query)))
        : true;
      return matchTag && matchQuery;
    });
  });

  // 2. Tomar la rebanada correspondiente según la paginación local
  readonly paginatedArticles = computed(() => {
    const filtered = this.filteredArticles();
    const limit = this._currentPage() * this.pageSize;
    return filtered.slice(0, limit);
  });

  // 3. ¿Quedan más para mostrar localmente?
  readonly hasMore = computed(() => {
    return this.paginatedArticles().length < this.filteredArticles().length;
  });

  private readonly detailCache = new Map<string, Observable<Article>>();
  private initialized = false;

  constructor() {
    this.getArticles();
  }

  // Traer todos de una vez desde el endpoint
  getArticles(): void {
    if (typeof window === "undefined" || this.initialized) return;
    this._loading.set(true);

    // Pedimos 1000 para obtener "todos" los disponibles sin paginar manual
    const url = `/api/v1/articles?per_page=1000`;

    this.http.get<Article[]>(url).subscribe({
      next: (articles) => {
        if (!Array.isArray(articles)) return;
        this._allArticles.set(articles);
        this.initialized = true;
      },
      error: (err) => console.error("Error al cargar artículos:", err),
      complete: () => this._loading.set(false),
    });
  }

  getMoreArticles(): void {
    if (this.hasMore()) {
      this._currentPage.update(c => c + 1);
    }
  }

  filterByTag(tag: string | null): void {
    const next = tag ?? "";
    if (next === this._activeTag()) return;
    this._activeTag.set(next);
    this._currentPage.set(1);
  }

  setSearchQuery(query: string | null | undefined): void {
    const next = query ?? "";
    if (next === this._searchQuery()) return;
    this._searchQuery.set(next);
    this._currentPage.set(1);
  }

  getArticle(id: string): Observable<Article> {
    const cached = this.detailCache.get(id);
    if (cached) return cached;

    const request$ = this.http
      .get<Article>(`/api/v1/article/${id}`)
      .pipe(shareReplay(1));
    this.detailCache.set(id, request$);
    return request$;
  }

  createArticle(article: Omit<Article, "id">): Observable<Article> {
    return this.http.post<Article>("/api/v1/article", article).pipe(
      tap((created) => {
        this._allArticles.update((current) => [created, ...current]);
        this.detailCache.set(created.id, of(created).pipe(shareReplay(1)));
      })
    );
  }

  updateArticle(article: Article): Observable<Article> {
    return this.http
      .put<Article>(`/api/v1/article/${article.id}`, article)
      .pipe(
        tap((updated) => {
          this._allArticles.update((current) =>
            current.map((a) => (a.id === updated.id ? updated : a))
          );
          this.detailCache.set(updated.id, of(updated).pipe(shareReplay(1)));
        })
      );
  }

  deleteArticle(id: string): void {
    this.http.delete<void>(`/api/v1/article/${id}`).subscribe({
      next: () => {
        this._allArticles.update((current) => current.filter((a) => a.id !== id));
        this.detailCache.delete(id);
      },
      error: (err) => console.error("Error al eliminar artículo:", err),
    });
  }

  // Interacciones locales
  likeArticle(id: string): void {
    this._allArticles.update(articles => articles.map(a => {
      if (a.id === id) {
        return { ...a, likes: (a.likes || 0) + 1 };
      }
      return a;
    }));
  }

  shareArticle(id: string): void {
    this._allArticles.update(articles => articles.map(a => {
      if (a.id === id) {
        return { ...a, shares: (a.shares || 0) + 1 };
      }
      return a;
    }));
  }

  addComment(articleId: string, author: string, text: string): void {
    this._allArticles.update(articles => articles.map(a => {
      if (a.id === articleId) {
        const comentarios = a.comments || [];
        const nuevoComentario = {
          id: Date.now().toString(),
          author: author,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(author)}`,
          text: text,
          date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
        };
        const nuevosComentarios = [nuevoComentario, ...comentarios];
        return { ...a, comments: nuevosComentarios, commentsCount: nuevosComentarios.length };
      }
      return a;
    }));
  }

  toggleFavorite(id: string): void {
    this._favorites.update(favs => {
      const newFavs = new Set(favs);
      if (newFavs.has(id)) {
        newFavs.delete(id);
      } else {
        newFavs.add(id);
      }
      return newFavs;
    });
  }

  getFavorites(): Article[] {
    return this.favorites();
  }
}
