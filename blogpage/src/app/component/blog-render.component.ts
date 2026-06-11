import { Component, input, output, signal } from '@angular/core';
import { Article } from '../types/blog.type';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-blog-render',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto p-4 lg:p-6 text-left">
      
      <!-- Panel Izquierdo / Principal: Contenido del Artículo (Col 8) -->
      <article class="lg:col-span-8 bg-white border border-slate-200/60 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
        
        <!-- Categoría y Metadatos -->
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
            {{ article().category }}
          </span>
          <span class="text-xs text-slate-400 font-medium">{{ article().date }}</span>
        </div>

        <!-- Título -->
        <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
          {{ article().title }}
        </h1>

        <!-- Autor -->
        <div class="flex items-center gap-3 py-2 border-y border-slate-100">
          <img [src]="article().author.avatar" alt="Avatar del autor" class="w-10 h-10 rounded-full bg-slate-100" />
          <div>
            <h4 class="text-sm font-semibold text-slate-800">{{ article().author.name }}</h4>
            <p class="text-xs text-slate-400">Escritor y colaborador</p>
          </div>
        </div>

        <!-- Imagen de Portada -->
        @if (article().coverImage) {
          <div class="w-full rounded-2xl overflow-hidden shadow-sm max-h-[480px]">
            <img [src]="article().coverImage" [alt]="article().title" class="w-full h-full object-cover" />
          </div>
        }

        <!-- Bloques del Artículo (Parser de Editor.js) -->
        <div class="space-y-4 text-slate-700">
          @for (block of article().blocks; track $index) {
            
            <!-- Encabezados -->
            @if (block.type === 'header') {
              @if (block.data.level === 1) {
                <h1 class="text-3xl font-extrabold text-slate-900 mt-8 mb-4">{{ block.data.text }}</h1>
              } @else if (block.data.level === 2) {
                <h2 class="text-2xl font-bold text-slate-800 mt-6 mb-3">{{ block.data.text }}</h2>
              } @else {
                <h3 class="text-xl font-bold text-slate-800 mt-5 mb-2">{{ block.data.text }}</h3>
              }
            }
            
            <!-- Párrafos -->
            @if (block.type === 'paragraph') {
              <p class="leading-relaxed mb-4 text-justify text-[15px] sm:text-base text-slate-600" [innerHTML]="block.data.text"></p>
            }

            <!-- Listas -->
            @if (block.type === 'list') {
              @if (block.data.style === 'ordered') {
                <ol class="list-decimal pl-6 mb-4 space-y-2 text-slate-600">
                  @for (item of block.data.items; track item) {
                    <li [innerHTML]="item"></li>
                  }
                </ol>
              } @else {
                <ul class="list-disc pl-6 mb-4 space-y-2 text-slate-600">
                  @for (item of block.data.items; track item) {
                    <li [innerHTML]="item"></li>
                  }
                </ul>
              }
            }

            <!-- Imágenes de bloques -->
            @if (block.type === 'image') {
              <div class="my-6 space-y-2">
                <div class="rounded-xl overflow-hidden border border-slate-100 shadow-sm max-h-[400px]">
                  <img [src]="block.data.file?.url" [alt]="block.data.caption" class="w-full h-full object-cover" />
                </div>
                @if (block.data.caption) {
                  <p class="text-center text-xs text-slate-400 italic">{{ block.data.caption }}</p>
                }
              </div>
            }

          }
        </div>

        <!-- Etiquetas (Tags) -->
        @if (article().tags && article().tags?.length) {
          <div class="flex flex-wrap gap-2 pt-4">
            @for (tag of article().tags; track tag) {
              <span class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-full transition-colors cursor-pointer">
                #{{ tag }}
              </span>
            }
          </div>
        }

        <!-- Acciones Inferiores (Likes, Comments, Shares) -->
        <div class="flex items-center gap-6 pt-6 border-t border-slate-100 text-sm font-semibold text-slate-500">
          <button (click)="onLike()" class="flex items-center gap-2 hover:text-red-500 transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <span>{{ article().likes }} Me Gusta</span>
          </button>
          
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48L4.35 19.65a.75.75 0 0 0 .956.837l2.87-1.125c1.154.588 2.477.888 3.824.888Z" />
            </svg>
            <span>{{ article().commentsCount }} Comentarios</span>
          </div>

          <button (click)="onShare()" class="flex items-center gap-2 hover:text-blue-500 transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
            <span>{{ article().shares }} Compartidos</span>
          </button>
        </div>

        <!-- Sección de Comentarios -->
        <div class="pt-6 border-t border-slate-100 space-y-6">
          <h3 class="text-xl font-bold text-slate-800">Comentarios</h3>
          
          <!-- Formulario de comentario -->
          <div class="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-3">
            <span class="text-xs font-semibold text-slate-500">Deja tu comentario</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                #authorInput 
                type="text" 
                placeholder="Tu nombre" 
                class="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <textarea 
              #textInput 
              rows="3" 
              placeholder="Escribe aquí tu opinión..." 
              class="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"></textarea>
            
            <div class="flex justify-end">
              <button 
                (click)="submitComment(authorInput.value, textInput.value); authorInput.value = ''; textInput.value = ''"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm">
                Comentar
              </button>
            </div>
          </div>

          <!-- Listado de Comentarios -->
          <div class="space-y-4">
            @for (comment of article().comments; track comment.id) {
              <div class="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl">
                <img [src]="comment.avatar" alt="Avatar" class="w-8 h-8 rounded-full bg-slate-50" />
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-slate-800">{{ comment.author }}</span>
                    <span class="text-[10px] text-slate-400">{{ comment.date }}</span>
                  </div>
                  <p class="text-sm text-slate-600 text-justify">{{ comment.text }}</p>
                </div>
              </div>
            } @empty {
              <p class="text-sm text-slate-400 text-center py-4">No hay comentarios en este artículo. ¡Sé el primero en comentar!</p>
            }
          </div>
        </div>

      </article>

      <!-- Panel Derecho / Sidebar: Compartir y Artículos Relacionados (Col 4) -->
      <aside class="lg:col-span-4 space-y-6">
        
        <!-- Compartir En Redes -->
        <div class="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Compartir en</h3>
          <div class="flex flex-wrap gap-2">
            <!-- Botones Similares a Redes Sociales -->
            <button (click)="onShare()" class="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-150 transition-colors text-slate-500" title="LinkedIn">
              <span class="text-xs font-semibold px-1">LinkedIn</span>
            </button>
            <button (click)="onShare()" class="p-2 rounded-lg bg-slate-50 hover:bg-green-50 hover:text-green-600 border border-slate-150 transition-colors text-slate-500" title="WhatsApp">
              <span class="text-xs font-semibold px-1">WhatsApp</span>
            </button>
            <button (click)="onShare()" class="p-2 rounded-lg bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-150 transition-colors text-slate-500" title="X (Twitter)">
              <span class="text-xs font-semibold px-1">X / Twitter</span>
            </button>
            <button (click)="onShare()" class="p-2 rounded-lg bg-slate-50 hover:bg-blue-100 hover:text-blue-800 border border-slate-150 transition-colors text-slate-500" title="Facebook">
              <span class="text-xs font-semibold px-1">Facebook</span>
            </button>
          </div>
        </div>

        <!-- Artículos Relacionados -->
        <div class="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Artículos Relacionados</h3>
          
          <div class="space-y-4">
            @for (rel of relatedArticles(); track rel.id) {
              <div 
                (click)="onSelectRelated(rel)" 
                class="flex gap-3 items-start cursor-pointer hover:bg-slate-50/70 p-2 rounded-lg transition-colors group">
                
                @if (rel.coverImage) {
                  <img [src]="rel.coverImage" alt="Portada de artículo relacionado" class="w-16 h-16 object-cover rounded-lg bg-slate-100 shrink-0 shadow-sm" />
                }
                
                <div class="space-y-1">
                  <span class="text-[10px] font-semibold text-blue-600 uppercase">{{ rel.category }}</span>
                  <h4 class="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {{ rel.title }}
                  </h4>
                </div>
              </div>
            } @empty {
              <p class="text-xs text-slate-400 italic">No hay artículos relacionados encontrados.</p>
            }
          </div>
        </div>

      </aside>

    </div>
  `
})
export class BlogRenderComponent {
  // Inputs
  article = input.required<Article>();
  relatedArticles = input<Article[]>([]);

  // Outputs
  like = output<string>();
  share = output<string>();
  addComment = output<{ articleId: string; author: string; text: string }>();
  articleSelect = output<Article>();

  onLike() {
    this.like.emit(this.article().id);
  }

  onShare() {
    this.share.emit(this.article().id);
    alert('¡Enlace copiado! Comparte este artículo con tus amigos.');
  }

  onSelectRelated(article: Article) {
    this.articleSelect.emit(article);
  }

  submitComment(author: string, text: string) {
    if (!author.trim() || !text.trim()) {
      alert('Por favor, ingresa tu nombre y un comentario válido.');
      return;
    }
    this.addComment.emit({
      articleId: this.article().id,
      author: author.trim(),
      text: text.trim()
    });
  }
}

/* 
 * RESUMEN DEL ARCHIVO:
 * Este componente se encarga exclusivamente de leer los datos JSON de un artículo y dibujarlos (renderizarlos) en la pantalla con su formato correcto (títulos, párrafos, imágenes).
 * Es la "ficha del elemento" que mencionaba la consigna.
 * Comparación con Expo: En Expo, esto sería una pantalla de "Detalle" que recibe los datos por parámetros de navegación (route.params) y usa un componente <FlatList> o un `.map()` para iterar sobre los bloques del artículo y mostrar <Text> o <Image> según corresponda.
 */
