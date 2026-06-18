import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BlogRenderComponent } from '../../component/blog-render.component';
import { BlogService } from '../../services/blog.service';
import { Article } from '../../types/blog.type';

@Component({
  standalone: true,
  imports: [BlogRenderComponent, RouterLink],
  template: `
    <main class="min-h-screen bg-slate-50 text-slate-800">
      <header class="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4">
        <div class="max-w-6xl mx-auto flex items-center justify-start">
          <a
            routerLink="/"
            class="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors">
            <span aria-hidden="true">←</span>
            Volver al explorador
          </a>
        </div>
      </header>

      @if (article(); as article) {
        <div class="py-6">
          <app-blog-render
            [article]="article"
            [relatedArticles]="relatedArticles()"
            (like)="likeArticle($event)"
            (share)="shareArticle($event)"
            (addComment)="addComment($event)"
            (articleSelect)="openRelated($event)" />
        </div>
      } @else if (loading()) {
        <section class="max-w-4xl mx-auto px-6 py-16 text-center">
          <p class="text-sm font-semibold text-slate-500">Cargando detalle del articulo...</p>
        </section>
      } @else {
        <section class="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
          <h1 class="text-3xl font-extrabold text-slate-900">Articulo no encontrado</h1>
          <p class="text-slate-500">{{ error() || 'No existe detalle disponible en la API para este ID.' }}</p>
          <a routerLink="/" class="inline-flex px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
            Volver al inicio
          </a>
        </section>
      }
    </main>
  `,
})
export default class ArticleDetailPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(BlogService);

  id = toSignal(this.route.paramMap.pipe(map((params) => params.get('id') ?? '')), {
    initialValue: '',
  });

  article = signal<Article | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  relatedArticles = computed(() => {
    const article = this.article();
    return article ? this.blogService.obtenerArticulosRelacionados(article) : [];
  });

  constructor() {
    effect(() => {
      const id = this.id();

      if (!id) {
        return;
      }

      void this.loadApiArticle(id);
    });
  }

  private async loadApiArticle(id: string) {
    this.loading.set(true);
    this.error.set(null);
    this.article.set(null);

    try {
      const article = await this.blogService.obtenerDetalleArticulo(id);
      if (this.id() === id) {
        this.article.set(article);
      }
    } catch (error) {
      if (this.id() === id) {
        this.error.set(error instanceof Error ? error.message : 'No se pudo cargar el articulo.');
      }
    } finally {
      if (this.id() === id) {
        this.loading.set(false);
      }
    }
  }

  likeArticle(id: string) {
    this.blogService.darMeGusta(id);
    const updated = this.blogService.obtenerArticuloPorId(id);
    if (updated) {
      this.article.set(updated);
    }
  }

  shareArticle(id: string) {
    this.blogService.compartirArticulo(id);
    const updated = this.blogService.obtenerArticuloPorId(id);
    if (updated) {
      this.article.set(updated);
    }
  }

  addComment(event: { articleId: string; author: string; text: string }) {
    this.blogService.agregarComentario(event.articleId, event.author, event.text);
    const updated = this.blogService.obtenerArticuloPorId(event.articleId);
    if (updated) {
      this.article.set(updated);
    }
  }

  openRelated(article: Article) {
    void this.router.navigate(['/articles', article.id]);
  }
}
