import { Component, input, output } from "@angular/core";
import { Article } from "@models/article.model";

@Component({
  selector: "app-article-sidebar",
  standalone: true,
  template: `
    <aside class="space-y-6 w-full">

      <!-- Compartir en redes -->
      <div class="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
          Compartir en
        </h3>
        <div class="flex flex-wrap gap-2">
          <button (click)="share.emit()" class="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors text-slate-500 text-xs font-semibold px-3 cursor-pointer">LinkedIn</button>
          <button (click)="share.emit()" class="p-2 rounded-lg bg-slate-50 hover:bg-green-50 hover:text-green-600 border border-slate-200 transition-colors text-slate-500 text-xs font-semibold px-3 cursor-pointer">WhatsApp</button>
          <button (click)="share.emit()" class="p-2 rounded-lg bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 transition-colors text-slate-500 text-xs font-semibold px-3 cursor-pointer">X / Twitter</button>
          <button (click)="share.emit()" class="p-2 rounded-lg bg-slate-50 hover:bg-blue-100 hover:text-blue-800 border border-slate-200 transition-colors text-slate-500 text-xs font-semibold px-3 cursor-pointer">Facebook</button>
        </div>
      </div>

      <!-- Artículos Relacionados -->
      <div class="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
          Artículos Relacionados
        </h3>
        <div class="space-y-4">
          @for (rel of relatedArticles(); track rel.id) {
            <div
              (click)="articleSelect.emit(rel)"
              class="flex gap-3 items-start cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors group"
            >
              @if (rel.coverImage) {
                <img [src]="rel.coverImage" alt="Portada" class="w-16 h-16 object-cover rounded-lg bg-slate-100 shrink-0 shadow-sm" />
              }
              <div class="space-y-1">
                <span class="text-[10px] font-semibold text-red-600 uppercase">{{ rel.category }}</span>
                <h4 class="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                  {{ rel.title }}
                </h4>
              </div>
            </div>
          } @empty {
            <p class="text-xs text-slate-400 italic">No hay artículos relacionados.</p>
          }
        </div>
      </div>

    </aside>
  `,
})
export class ArticleSidebarComponent {
  relatedArticles = input<Article[]>([]);
  share = output<void>();
  articleSelect = output<Article>();
}
