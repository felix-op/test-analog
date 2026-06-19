import { Component, input } from "@angular/core";
import { Comment } from "@models/comment.model";

@Component({
  selector: "app-article-comment-list",
  standalone: true,
  host: { class: 'block' },
  template: `
    <div class="space-y-4">
      @for (comment of comments(); track comment.id) {
        <div class="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl">
          <img [src]="comment.avatar" alt="Avatar" class="w-8 h-8 rounded-full bg-slate-50 shrink-0" />
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-slate-800">{{ comment.author }}</span>
              <span class="text-[10px] text-slate-400">{{ comment.date }}</span>
            </div>
            <p class="text-sm text-slate-600">{{ comment.text }}</p>
          </div>
        </div>
      } @empty {
        <p class="text-sm text-slate-400 text-center py-4">
          No hay comentarios aún. ¡Sé el primero en comentar!
        </p>
      }
    </div>
  `,
})
export class ArticleCommentListComponent {
  comments = input<Comment[]>([]);
}
