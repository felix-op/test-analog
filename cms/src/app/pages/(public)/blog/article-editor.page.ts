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
import { CampoInputComponent } from '@components/campo-input.component';
import { CampoSelectorComponent } from '@components/campo-selector.component';
import { CampoEditorComponent } from '@components/campo-editor.component';
import { Article } from '@models/article.model';
import { Block } from '@models/block.model';

@Component({
  selector: 'app-article-editor',
  imports: [CampoInputComponent, CampoSelectorComponent, CampoEditorComponent],
  template: `
    <div class="max-w-3xl mx-auto p-6 space-y-6 text-left">

      <!-- Encabezado -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 class="text-xl font-extrabold text-slate-800">
            {{ articleId ? 'Editar Artículo' : 'Nuevo Artículo' }}
          </h1>
          <p class="text-[11px] text-slate-400 font-medium mt-0.5">
            {{ articleId
              ? 'Modificá el contenido y guardá los cambios'
              : 'Completá los campos para publicar un nuevo artículo' }}
          </p>
        </div>
        <button
          (click)="cancel()"
          class="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>

      <!-- Metadatos -->
      <div class="flex flex-col bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Metadatos</h3>

        <app-campo-input
          label="Título"
          placeholder="Ej. Avances en inteligencia artificial"
          [required]="true"
          [(value)]="title"
          [error]="errors.title()"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <app-campo-selector
            label="Categoría"
            placeholder="Seleccioná una categoría"
            [options]="tagsService.tags()"
            [required]="true"
            [(value)]="category"
            [error]="errors.category()"
          />

          <app-campo-input
            label="Autor"
            placeholder="Ej. María García"
            [required]="true"
            [(value)]="authorName"
            [error]="errors.author()"
          />
        </div>

        <app-campo-input
          label="Tags"
          placeholder="Ej. angular, typescript, web"
          [(value)]="tags"
        />

        <app-campo-input
          label="URL de Portada"
          placeholder="https://images.unsplash.com/..."
          type="url"
          [(value)]="coverImage"
        />
      </div>

      <!-- Editor de contenido -->
      @if (editorReady()) {
        <app-campo-editor
          #editorRef
          [initialBlocks]="initialBlocks()"
          [error]="errors.content()"
        />
      } @else {
        <div class="bg-white border border-slate-200 rounded-2xl min-h-64 flex items-center justify-center shadow-sm">
          <p class="text-sm text-slate-400 font-medium">Cargando editor…</p>
        </div>
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

  @ViewChild('editorRef') editorRef?: CampoEditorComponent;

  @Input() articleId: string = '';

  // Campos del formulario (two-way binding con [(value)] en los campos)
  title = signal('');
  category = signal('');
  tags = signal('');
  coverImage = signal('');
  authorName = signal('');

  initialBlocks = signal<Block[]>([]);
  editorReady = signal(false);
  saving = signal(false);

  // Errores por campo
  errors = {
    title: signal(''),
    category: signal(''),
    author: signal(''),
    content: signal(''),
  };

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

  private validate(blocks: Block[]): boolean {
    let valid = true;

    if (!this.title().trim()) {
      this.errors.title.set('El título es obligatorio.');
      valid = false;
    } else {
      this.errors.title.set('');
    }

    if (!this.category().trim()) {
      this.errors.category.set('La categoría es obligatoria.');
      valid = false;
    } else {
      this.errors.category.set('');
    }

    if (!this.authorName().trim()) {
      this.errors.author.set('El autor es obligatorio.');
      valid = false;
    } else {
      this.errors.author.set('');
    }

    if (blocks.length === 0) {
      this.errors.content.set('El contenido no puede estar vacío.');
      valid = false;
    } else {
      this.errors.content.set('');
    }

    return valid;
  }

  async save() {
    this.saving.set(true);

    const blocks = (await this.editorRef?.getBlocks()) ?? [];

    if (!this.validate(blocks)) {
      this.saving.set(false);
      return;
    }

    const tagsArray = this.tags()
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: this.title().trim(),
      category: this.category(),
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
        name: this.authorName().trim(),
        avatar:
          this.existing?.author.avatar ??
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(this.authorName().trim())}`,
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
        this.errors.content.set('Ocurrió un error al guardar. Intentá de nuevo.');
      },
    });
  }

  cancel() {
    this.router.navigate(['/blog/explorer']);
  }
}
