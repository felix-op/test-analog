import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ArticlesService } from '@services/articles.service';
import { TagsService } from '@services/tags.service';
import { EditorContentComponent } from '@components/editor-content.component';
import { Article } from '@models/article.model';
import { Block } from '@models/block.model';

@Component({
  selector: 'app-article-editor',
  imports: [EditorContentComponent],
  template: `
    <div class="max-w-3xl mx-auto p-6 space-y-6 text-left">

      <!-- Encabezado -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 class="text-xl font-extrabold text-slate-800">
            {{ articleId ? 'Editar Artículo' : 'Nuevo Artículo' }}
          </h1>
          <p class="text-[11px] text-slate-400 font-medium mt-0.5">
            {{ articleId ? 'Modificá el contenido y guardá los cambios' : 'Completá los campos para publicar un nuevo artículo' }}
          </p>
        </div>
        <button
          (click)="cancel()"
          class="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>

      <!-- Formulario de metadatos -->
      <div class="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Metadatos
        </h3>

        <!-- Título -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-600">Título *</label>
          <input
            type="text"
            [value]="title()"
            (input)="title.set(val($event))"
            placeholder="Ej. Avances en inteligencia artificial"
            class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Categoría (select de tags existentes) -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-600">Categoría *</label>
            <select
              [value]="category()"
              (change)="category.set(val($event))"
              class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Seleccioná una categoría</option>
              @for (tag of tagsService.tags(); track tag) {
                <option [value]="tag">{{ tag }}</option>
              }
            </select>
          </div>

          <!-- Autor -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-600">Autor *</label>
            <input
              type="text"
              [value]="authorName()"
              (input)="authorName.set(val($event))"
              placeholder="Ej. María García"
              class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Tags -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-600">
            Tags
            <span class="font-normal text-slate-400">(separados por coma)</span>
          </label>
          <input
            type="text"
            [value]="tags()"
            (input)="tags.set(val($event))"
            placeholder="Ej. angular, typescript, web"
            class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Portada -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-600">
            URL de Portada
            <span class="font-normal text-slate-400">(opcional)</span>
          </label>
          <input
            type="url"
            [value]="coverImage()"
            (input)="coverImage.set(val($event))"
            placeholder="https://images.unsplash.com/..."
            class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Editor de contenido (solo se monta cuando los datos están listos) -->
      <div class="space-y-2">
        <label class="text-xs font-bold text-slate-600 uppercase tracking-wider block">
          Contenido del Artículo
        </label>

        @if (editorReady()) {
          <app-editor-content #editorRef [initialBlocks]="initialBlocks()" />
        } @else {
          <div class="bg-white border border-slate-200 rounded-2xl min-h-64 flex items-center justify-center shadow-sm">
            <p class="text-sm text-slate-400 font-medium">Cargando editor…</p>
          </div>
        }
      </div>

      <!-- Error de validación -->
      @if (validationError()) {
        <p class="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ validationError() }}
        </p>
      }

      <!-- Acciones -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          (click)="cancel()"
          class="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          (click)="save()"
          [disabled]="saving()"
          class="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ saving() ? 'Guardando…' : 'Guardar Artículo' }}
        </button>
      </div>

    </div>
  `,
})
export default class ArticleEditorPage implements OnInit {
  private readonly router = inject(Router);
  private readonly articlesService = inject(ArticlesService);
  protected readonly tagsService = inject(TagsService);

  @ViewChild('editorRef') editorRef?: EditorContentComponent;

  // Recibe el id del artículo a editar vía query param (?articleId=xxx)
  @Input() articleId: string = '';

  // Estado del formulario
  title = signal('');
  category = signal('');
  tags = signal('');
  coverImage = signal('');
  authorName = signal('');

  initialBlocks = signal<Block[]>([]);
  editorReady = signal(false);
  saving = signal(false);
  validationError = signal('');

  private existing: Article | null = null;

  ngOnInit() {
    if (this.articleId) {
      this.articlesService.getArticle(this.articleId).subscribe({
        next: (art) => {
          this.existing = art;
          this.title.set(art.title);
          this.category.set(art.category);
          this.tags.set(art.tags?.join(', ') ?? '');
          this.coverImage.set(art.coverImage ?? '');
          this.authorName.set(art.author.name);
          this.initialBlocks.set(art.blocks ?? []);
          this.editorReady.set(true);
        },
        error: (err) => {
          console.error('Error al cargar artículo para edición:', err);
          this.editorReady.set(true);
        },
      });
    } else {
      this.editorReady.set(true);
    }
  }

  // Extrae el valor de un input/select desde el evento nativo
  val(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  async save() {
    this.validationError.set('');

    const titleVal = this.title().trim();
    const authorVal = this.authorName().trim();
    const categoryVal = this.category().trim();

    if (!titleVal) return this.validationError.set('El título es obligatorio.');
    if (!authorVal) return this.validationError.set('El autor es obligatorio.');
    if (!categoryVal) return this.validationError.set('La categoría es obligatoria.');

    this.saving.set(true);

    const blocks = (await this.editorRef?.getBlocks()) ?? [];
    const tagsArray = this.tags()
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: titleVal,
      category: categoryVal,
      tags: tagsArray,
      coverImage:
        this.coverImage().trim() ||
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000',
      date:
        this.existing?.date ??
        new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      author: {
        name: authorVal,
        avatar:
          this.existing?.author.avatar ??
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorVal)}`,
      },
      likes: this.existing?.likes ?? 0,
      commentsCount: this.existing?.commentsCount ?? 0,
      shares: this.existing?.shares ?? 0,
      blocks,
      comments: this.existing?.comments ?? [],
    };

    const request$ = this.existing
      ? this.articlesService.updateArticle({ id: this.existing.id, ...payload })
      : this.articlesService.createArticle(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/blog/explorer']),
      error: (err) => {
        console.error('Error al guardar artículo:', err);
        this.saving.set(false);
        this.validationError.set('Ocurrió un error al guardar. Intentá de nuevo.');
      },
    });
  }

  cancel() {
    this.router.navigate(['/blog/explorer']);
  }
}
