import { Component, model, output } from "@angular/core";
import { CampoInputComponent } from "./campo-input.component";

@Component({
  selector: "app-article-comment-form",
  standalone: true,
  imports: [CampoInputComponent],
  template: `
    <div class="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-3">
      <span class="text-xs font-semibold text-slate-500">Deja tu comentario</span>

      <app-campo-input
        label="Tu nombre"
        placeholder="Ej: Juan García"
        [(value)]="author"
      />

      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold text-slate-600">Comentario</label>
        <textarea
          [value]="text()"
          (input)="text.set(val($event))"
          rows="3"
          placeholder="Escribe aquí tu opinión..."
          class="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
        ></textarea>
      </div>

      <div class="flex justify-end">
        <button
          (click)="submit()"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          Comentar
        </button>
      </div>
    </div>
  `,
})
export class ArticleCommentFormComponent {
  author = model<string>("");
  text = model<string>("");

  submitted = output<{ author: string; text: string }>();

  val(event: Event): string {
    return (event.target as HTMLTextAreaElement).value;
  }

  submit() {
    const author = this.author().trim();
    const text = this.text().trim();
    if (!author || !text) {
      alert("Por favor, ingresa tu nombre y un comentario válido.");
      return;
    }
    this.submitted.emit({ author, text });
    this.author.set("");
    this.text.set("");
  }
}
