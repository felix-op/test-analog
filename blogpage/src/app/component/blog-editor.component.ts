import { Component, afterNextRender, signal, effect, input, output, inject, OnDestroy } from '@angular/core';
import { Article } from '../types/blog.type';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [],
  template: `
    <div class="max-w-3xl mx-auto p-4 lg:p-6 text-left space-y-6">
      
      <!-- Encabezado del Editor -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 class="text-2xl font-bold text-slate-800">
          {{ article() ? 'Editar Artículo' : 'Crear Nuevo Artículo' }}
        </h1>
        <button 
          (click)="onCancel()"
          class="px-3.5 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          Cancelar
        </button>
      </div>

      <!-- Formulario de Metadatos -->
      <div class="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider">Metadatos del Artículo</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Título -->
          <div class="flex flex-col gap-1.5 md:col-span-2">
            <label class="text-xs font-bold text-slate-600">Título del Artículo *</label>
            <input 
              type="text" 
              [value]="title()" 
              (input)="updateSignal(title, $event)"
              placeholder="Ej. Avances en IA y Sostenibilidad" 
              class="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <!-- Categoría -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-600">Categoría *</label>
            <select 
              [value]="category()" 
              (change)="updateSignal(category, $event)"
              class="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              @for (cat of blogService.categories; track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
          </div>

          <!-- Nombre del Autor -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-600">Nombre del Autor *</label>
            <input 
              type="text" 
              [value]="authorName()" 
              (input)="updateSignal(authorName, $event)"
              placeholder="Ej. Pablo Donato" 
              class="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <!-- URL de Portada -->
          <div class="flex flex-col gap-1.5 md:col-span-2">
            <label class="text-xs font-bold text-slate-600">URL de Imagen de Portada (Opcional)</label>
            <input 
              type="text" 
              [value]="coverImage()" 
              (input)="updateSignal(coverImage, $event)"
              placeholder="Ej. https://images.unsplash.com/... o dejar vacío" 
              class="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <!-- Etiquetas -->
          <div class="flex flex-col gap-1.5 md:col-span-2">
            <label class="text-xs font-bold text-slate-600">Temas / Etiquetas Relacionados (Separados por coma)</label>
            <input 
              type="text" 
              [value]="tags()" 
              (input)="updateSignal(tags, $event)"
              placeholder="Ej. Clima, ASEAN, Innovación" 
              class="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>

      <!-- Editor de Contenido -->
      <div class="space-y-2">
        <label class="text-xs font-bold text-slate-600 uppercase tracking-wider block px-1">Contenido del Artículo (Cuerpo)</label>
        
        <!-- Contenedor del Editor.js -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[350px]">
          <div id="editorjs" class="prose max-w-none text-slate-700"></div>
        </div>
      </div>

      <!-- Acciones de Guardado -->
      <div class="flex items-center gap-3 justify-end pt-2">
        <button 
          (click)="onCancel()"
          class="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
        <button 
          (click)="guardar()" 
          class="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10">
          Guardar Artículo
        </button>
      </div>

    </div>
  `
})
export class BlogEditorComponent implements OnDestroy {
  blogService = inject(BlogService);

  // Inputs
  article = input<Article | null>(null);

  // Outputs
  saved = output<Article>();
  cancelled = output<void>();

  // Elementos internos y referencias
  editor: any = null;

  // Form State
  title = signal('');
  category = signal('Política');
  tags = signal('');
  coverImage = signal('');
  authorName = signal('');

  constructor() {
    // Escucha cambios en el input del artículo para sincronizar los signals locales
    effect(() => {
      const art = this.article();
      if (art) {
        this.title.set(art.title);
        this.category.set(art.category);
        this.tags.set(art.tags ? art.tags.join(', ') : '');
        this.coverImage.set(art.coverImage || '');
        this.authorName.set(art.author.name);
      } else {
        this.title.set('');
        this.category.set('Política');
        this.tags.set('');
        this.coverImage.set('');
        this.authorName.set('');
      }
    });

    // Inicializamos Editor.js asíncronamente en el navegador
    afterNextRender(async () => {
      const EditorJS = (await import('@editorjs/editorjs')).default;
      // @ts-ignore
      const Header = (await import('@editorjs/header')).default;
      // @ts-ignore
      const List = (await import('@editorjs/list')).default;
      // @ts-ignore
      const ImageTool = (await import('@editorjs/image')).default;

      this.editor = new EditorJS({
        holder: 'editorjs',
        data: {
          blocks: this.article() ? this.article()!.blocks : []
        },
        tools: {
          header: {
            class: Header,
            inlineToolbar: true
          },
          list: {
            class: List,
            inlineToolbar: true
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile(file: File) {
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      resolve({
                        success: 1,
                        file: {
                          url: e.target?.result // URL en Base64
                        }
                      });
                    };
                    reader.readAsDataURL(file);
                  });
                },
                uploadByUrl(url: string) {
                  return new Promise((resolve) => {
                    resolve({
                      success: 1,
                      file: { url }
                    });
                  });
                }
              }
            }
          }
        },
        placeholder: 'Haz clic aquí para escribir el contenido. Presiona Tab para ver opciones de bloque.'
      });
    });
  }

  updateSignal(sig: any, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    sig.set(value);
  }

  async guardar() {
    const titleVal = this.title().trim();
    const authorVal = this.authorName().trim();
    const categoryVal = this.category();

    if (!titleVal || !authorVal) {
      alert('Por favor, completa los campos requeridos (Título y Autor).');
      return;
    }

    try {
      if (!this.editor) return;
      const outputData = await this.editor.save();
      
      const tagsArray = this.tags()
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      // Si no hay cover image, asignamos una por defecto basada en la categoría
      let coverImg = this.coverImage().trim();
      if (!coverImg) {
        coverImg = 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1000&auto=format&fit=crop&q=80'; // Genérica de lectura/blog
      }

      const existingArt = this.article();

      const savedArticle: Article = {
        id: existingArt?.id || Date.now().toString(),
        title: titleVal,
        category: categoryVal,
        tags: tagsArray,
        coverImage: coverImg,
        date: existingArt?.date || new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        author: {
          name: authorVal,
          avatar: existingArt?.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorVal)}`
        },
        likes: existingArt?.likes || 0,
        commentsCount: existingArt?.commentsCount || 0,
        shares: existingArt?.shares || 0,
        blocks: outputData.blocks,
        comments: existingArt?.comments || []
      };

      // Guardar en persistencia local
      this.blogService.guardarArticulo(savedArticle);
      
      // Emitir evento con el artículo guardado
      this.saved.emit(savedArticle);
      
    } catch (error) {
      console.error('Error al guardar el contenido de Editor.js:', error);
      alert('Ocurrió un error al guardar el artículo.');
    }
  }

  onCancel() {
    this.cancelled.emit();
  }

  ngOnDestroy() {
    if (this.editor && typeof this.editor.destroy === 'function') {
      try {
        this.editor.destroy();
      } catch (e) {
        console.error('Error al destruir instancia de EditorJS:', e);
      }
    }
  }
}
/* 
 * RESUMEN DEL ARCHIVO:
 * Este componente es el encargado de crear y editar los artículos del blog usando EditorJS. 
 * Maneja el estado temporal de lo que el usuario escribe antes de guardarlo.
 * Comparación con Expo: En Expo, esto sería un componente que contiene múltiples <TextInput> y maneja el estado local con useState() para guardar el título, contenido y categoría antes de enviar un formulario.
 */
