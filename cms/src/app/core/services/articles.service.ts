import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, shareReplay, tap } from "rxjs";
import { Article } from "@models/article.model";

@Injectable({ providedIn: "root" })
export class ArticlesService {
  private readonly http = inject(HttpClient);

  private readonly _articles = signal<Article[]>([]);
  readonly articles = this._articles.asReadonly();

  private readonly _hasMore = signal<boolean>(true);
  readonly hasMore = this._hasMore.asReadonly();

  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  private readonly _currentPage = signal<number>(1);
  readonly currentPage = this._currentPage.asReadonly();

  private readonly _activeTag = signal<string>("");
  readonly activeTag = this._activeTag.asReadonly();

  private readonly detailCache = new Map<string, Observable<Article>>();

  constructor() {
    this.getArticles(1);
  }

  getArticles(page: number = 1, tag?: string): void {
    if (typeof window === "undefined") return;
    this._loading.set(true);

    const activeTag = tag !== undefined ? tag : this._activeTag();
    let url = `/api/v1/articles?page=${page}&per_page=10`;
    if (activeTag) url += `&tag=${encodeURIComponent(activeTag.toLowerCase())}`;

    this.http.get<Article[]>(url).subscribe({
      next: (articles) => {
        if (!Array.isArray(articles)) return;
        this._hasMore.set(articles.length >= 10);
        if (page === 1) {
          this._articles.set(articles);
        } else {
          this._articles.update((current) => [...current, ...articles]);
        }
        this._currentPage.set(page);
      },
      error: (err) => console.error("Error al cargar artículos:", err),
      complete: () => this._loading.set(false),
    });
  }

  getMoreArticles(): void {
    if (this._loading() || !this._hasMore()) return;
    this.getArticles(this._currentPage() + 1);
  }

  filterByTag(tag: string | null): void {
    const next = tag ?? "";
    if (next === this._activeTag()) return;
    this._activeTag.set(next);
    this._currentPage.set(1);
    this._hasMore.set(true);
    this._articles.set([]);
    this.getArticles(1, next);
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
        this._articles.update((current) => [created, ...current]);
      })
    );
  }

  updateArticle(article: Article): Observable<Article> {
    return this.http
      .put<Article>(`/api/v1/article/${article.id}`, article)
      .pipe(
        tap((updated) => {
          this._articles.update((current) =>
            current.map((a) => (a.id === updated.id ? updated : a))
          );
          this.detailCache.delete(article.id);
        })
      );
  }

  deleteArticle(id: string): void {
    this.http.delete<void>(`/api/v1/article/${id}`).subscribe({
      next: () => {
        this._articles.update((current) => current.filter((a) => a.id !== id));
        this.detailCache.delete(id);
      },
      error: (err) => console.error("Error al eliminar artículo:", err),
    });
  }
}
