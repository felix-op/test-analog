import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class TagsService {
  private readonly http = inject(HttpClient);

  private readonly _tags = signal<string[]>([]);
  readonly tags = this._tags.asReadonly();

  private readonly _hasMore = signal<boolean>(true);
  readonly hasMore = this._hasMore.asReadonly();

  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  private readonly _currentPage = signal<number>(1);
  readonly currentPage = this._currentPage.asReadonly();

  constructor() {
    this.getTags(1);
  }

  getTags(page: number = 1): void {
    if (typeof window === "undefined") return;
    this._loading.set(true);

    this.http
      .get<string[]>(`/api/v1/tags?page=${page}&per_page=10`)
      .subscribe({
        next: (tags) => {
          if (!Array.isArray(tags)) return;
          this._hasMore.set(tags.length >= 10);
          if (page === 1) {
            this._tags.set(tags);
          } else {
            this._tags.update((current) => [...current, ...tags]);
          }
          this._currentPage.set(page);
        },
        error: (err) => console.error("Error al cargar tags:", err),
        complete: () => this._loading.set(false),
      });
  }

  getMoreTags(): void {
    if (this._loading() || !this._hasMore()) return;
    this.getTags(this._currentPage() + 1);
  }
}
