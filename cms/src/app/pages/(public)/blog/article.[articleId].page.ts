import { Component, inject, Input, OnInit, signal } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Article } from "@models/article.model";
import { ArticlesService } from "@services/articles.service";
import { ArticleSidebarComponent } from "@components/article-sidebar.component";
import { ArticleCommentFormComponent } from "@components/article-comment-form.component";
import { ArticleCommentListComponent } from "@components/article-comment-list.component";

@Component({
  selector: "app-blog-article",
  standalone: true,
  imports: [
    ArticleSidebarComponent,
    ArticleCommentFormComponent,
    ArticleCommentListComponent,
  ],
  template: `
    @if (loading()) {
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        <div class="lg:col-span-8 bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm space-y-6 animate-pulse">
          <div class="h-4 w-24 bg-slate-100 rounded"></div>
          <div class="h-8 w-3/4 bg-slate-100 rounded"></div>
          <div class="h-4 w-48 bg-slate-100 rounded"></div>
          <div class="w-full h-64 bg-slate-100 rounded-2xl"></div>
          <div class="space-y-3">
            <div class="h-4 w-full bg-slate-100 rounded"></div>
            <div class="h-4 w-5/6 bg-slate-100 rounded"></div>
            <div class="h-4 w-4/6 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>

    } @else if (error()) {
      <div class="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <h1 class="text-3xl font-extrabold text-slate-900">Artículo no encontrado</h1>
        <p class="text-slate-500">{{ error() }}</p>
      </div>

    } @else if (article()) {
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto text-left">

        <!-- Artículo principal -->
        <article class="lg:col-span-8 bg-white border border-slate-200/60 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">

          <!-- Categoría y fecha -->
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              {{ article()!.category }}
            </span>
            <span class="text-xs text-slate-400 font-medium">{{ article()!.date }}</span>
          </div>

          <!-- Título -->
          <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
            {{ article()!.title }}
          </h1>

          <!-- Autor -->
          <div class="flex items-center gap-3 py-2 border-y border-slate-100">
            <img [src]="article()!.author.avatar" alt="Avatar" class="w-10 h-10 rounded-full bg-slate-100" />
            <div>
              <h4 class="text-sm font-semibold text-slate-800">{{ article()!.author.name }}</h4>
              <p class="text-xs text-slate-400">Escritor y colaborador</p>
            </div>
          </div>

          <!-- Portada -->
          @if (article()!.coverImage) {
            <div class="w-full rounded-2xl overflow-hidden shadow-sm max-h-[480px]">
              <img [src]="article()!.coverImage" [alt]="article()!.title" class="w-full h-full object-cover" />
            </div>
          }

          <!-- Bloques de contenido -->
          <div class="space-y-4 text-slate-700">
            @for (block of article()!.blocks; track $index) {
              @if (block.type === 'header') {
                @if (block.data['level'] === 1) {
                  <h1 class="text-3xl font-extrabold text-slate-900 mt-8 mb-4">{{ block.data['text'] }}</h1>
                } @else if (block.data['level'] === 2) {
                  <h2 class="text-2xl font-bold text-slate-800 mt-6 mb-3">{{ block.data['text'] }}</h2>
                } @else {
                  <h3 class="text-xl font-bold text-slate-800 mt-5 mb-2">{{ block.data['text'] }}</h3>
                }
              }
              @if (block.type === 'paragraph' && parseParagraph(block.data['text'])) {
                <p class="leading-relaxed mb-4 text-[15px] text-slate-600" [innerHTML]="parseParagraph(block.data['text'])"></p>
              }
              @if (block.type === 'list') {
                @if (block.data['style'] === 'ordered') {
                  <ol class="list-decimal pl-6 mb-4 space-y-2 text-slate-600">
                    @for (item of block.data['items']; track item) {
                      <li [innerHTML]="item"></li>
                    }
                  </ol>
                } @else {
                  <ul class="list-disc pl-6 mb-4 space-y-2 text-slate-600">
                    @for (item of block.data['items']; track item) {
                      <li [innerHTML]="item"></li>
                    }
                  </ul>
                }
              }
              @if (block.type === 'image') {
                <div class="my-6 space-y-2">
                  <div class="rounded-xl overflow-hidden border border-slate-100 shadow-sm max-h-[400px]">
                    <img [src]="block.data['file']?.['url']" [alt]="block.data['caption']" class="w-full h-full object-cover" />
                  </div>
                  @if (block.data['caption']) {
                    <p class="text-center text-xs text-slate-400 italic">{{ block.data['caption'] }}</p>
                  }
                </div>
              }
            }
          </div>

          <!-- Tags -->
          @if (article()!.tags?.length) {
            <div class="flex flex-wrap gap-2 pt-4">
              @for (tag of article()!.tags; track tag) {
                <span class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-full transition-colors cursor-pointer">
                  #{{ tag }}
                </span>
              }
            </div>
          }

          <!-- Acciones: likes, comentarios, shares -->
          <div class="flex items-center gap-6 pt-6 border-t border-slate-100 text-sm font-semibold text-slate-500">
            <button (click)="likeArticle(article()!.id)" class="flex items-center gap-2 hover:text-red-500 transition-colors group cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <span>{{ article()!.likes }} Me Gusta</span>
            </button>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48L4.35 19.65a.75.75 0 0 0 .956.837l2.87-1.125c1.154.588 2.477.888 3.824.888Z" />
              </svg>
              <span>{{ article()!.commentsCount }} Comentarios</span>
            </div>
            <button (click)="shareArticle(article()!.id)" class="flex items-center gap-2 hover:text-blue-500 transition-colors group cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
              <span>{{ article()!.shares }} Compartidos</span>
            </button>
          </div>

          <!-- Comentarios -->
          <div class="pt-6 border-t border-slate-100 space-y-6">
            <h3 class="text-xl font-bold text-slate-800">Comentarios</h3>
            <app-article-comment-form (submitted)="addComment($event)" />
            <app-article-comment-list [comments]="article()!.comments ?? []" />
          </div>

        </article>

        <!-- Sidebar derecho -->
        <app-article-sidebar
          class="lg:col-span-4 block"
          [relatedArticles]="[]"
          (share)="shareArticle(article()!.id)"
          (articleSelect)="openRelated($event)"
        />

      </div>
    }
  `,
})
export default class ArticleDetailPage implements OnInit {
  private readonly articlesService = inject(ArticlesService);
  private readonly router = inject(Router);

  @Input() articleId: string = "";

  article = signal<Article | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loading.set(true);
    this.error.set(null);

    this.articlesService.getArticle(this.articleId).subscribe({
      next: (data) => {
        this.article.set(data);
        const allTypes = (data.blocks ?? []).map((b) => b.type);
        const uniqueTypes = [...new Set(allTypes)];
        const handled = ['header', 'paragraph', 'list', 'image'];
        const missing = uniqueTypes.filter((t) => !handled.includes(t));
        console.log('[Article blocks] Tipos encontrados:', uniqueTypes);
        if (missing.length) {
          console.warn('[Article blocks] Tipos sin renderizar:', missing);
        } else {
          console.log('[Article blocks] Todos los tipos están manejados.');
        }
      },
      error: (err) => {
        console.error("Error cargando el artículo", err);
        this.error.set("No se pudo cargar el artículo.");
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  private readonly sanitizer = inject(DomSanitizer);

  parseParagraph(text: string): SafeHtml {
    const html = text
      // Elimina Liquid tags {% ... %} (incluso multilínea)
      .replace(/\{%[\s\S]*?%\}/g, '')
      // Convierte --- en separador
      .replace(/^---+$/gm, '<hr class="border-slate-200 my-2">')
      // Convierte ### heading
      .replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-bold text-slate-800 mt-4 mb-1">$1</h3>')
      // Convierte ## heading
      .replace(/^##\s+(.+)$/gm, '<h2 class="text-xl font-bold text-slate-800 mt-5 mb-2">$1</h2>')
      // Convierte # heading
      .replace(/^#\s+(.+)$/gm, '<h1 class="text-2xl font-bold text-slate-900 mt-6 mb-2">$1</h1>')
      // Convierte markdown links [texto](url)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-red-600 hover:underline">$1</a>')
      // Convierte **negrita**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Convierte _cursiva_
      .replace(/\_(.+?)\_/g, '<em>$1</em>')
      // Convierte saltos de línea en <br>
      .replace(/\n/g, '<br>')
      .trim();

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  likeArticle(id: string) {
    this.articlesService.likeArticle(id);
    this.article.update(a => a ? { ...a, likes: (a.likes || 0) + 1 } : a);
  }

  shareArticle(id: string) {
    this.articlesService.shareArticle(id);
    this.article.update(a => a ? { ...a, shares: (a.shares || 0) + 1 } : a);
  }

  addComment(event: { author: string; text: string }) {
    this.articlesService.addComment(this.articleId, event.author, event.text);
    this.article.update(a => {
      if (!a) return a;
      const comentarios = a.comments || [];
      const nuevoComentario = {
        id: Date.now().toString(),
        author: event.author,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(event.author)}`,
        text: event.text,
        date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      const nuevosComentarios = [nuevoComentario, ...comentarios];
      return { ...a, comments: nuevosComentarios, commentsCount: nuevosComentarios.length };
    });
  }

  openRelated(article: Article) {
    console.log("openRelated", article);
    this.router.navigate(["/blog/article", article.id]);
  }
}
