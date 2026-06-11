import { Component, signal, computed, inject } from '@angular/core';
import { BarNavegacionComponent } from '../component/bar-navegacion.component';
import { BlogRenderComponent } from '../component/blog-render.component';
import { BlogEditorComponent } from '../component/blog-editor.component';
import { BlogService } from '../services/blog.service';
import { Article } from '../types/blog.type';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BarNavegacionComponent, BlogRenderComponent, BlogEditorComponent],
  template: `
    <div class="flex min-h-screen w-full bg-slate-50 text-slate-800">
      
      <!-- Barra de Navegación Lateral (Fija a la izquierda) -->
      <app-bar-navegacion 
        class="w-64 shrink-0 h-screen sticky top-0"
        [activeCategory]="selectedCategory()"
        [activeView]="activeView()"
        [categories]="blogService.categories"
        (categorySelected)="onCategorySelected($event)"
        (viewSelected)="onViewSelected($event)" />

      <!-- Panel de Contenido Principal (Scrollable) -->
      <div class="flex-1 flex flex-col h-screen overflow-y-auto">
        
        <!-- Barra de Encabezado Superior -->
        <header class="sticky top-0 bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between z-10 shadow-sm/5">
          
          <!-- Botón de retorno o título dinámico -->
          <div class="flex items-center gap-3">
            @if (activeView() !== 'explorer') {
              <button 
                (click)="goBack()"
                class="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors cursor-pointer group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Volver al Explorador
              </button>
            } @else {
              <div>
                <h2 class="text-base font-extrabold text-slate-900 tracking-tight">Portal Editorial</h2>
                <p class="text-[11px] text-slate-400 font-medium">Gestión y lectura de artículos de la comunidad</p>
              </div>
            }
          </div>

          <!-- Buscador por temas y título -->
          <div class="relative w-72">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
              </svg>
            </span>
            <input 
              type="text" 
              [value]="searchQuery()" 
              (input)="onSearchInput($event)" 
              placeholder="Buscar noticias o temas relacionados..." 
              class="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium" />
          </div>

        </header>

        <!-- Área de Trabajo -->
        <main class="flex-1 p-6">
          
          <!-- Vista 1: Explorador de Artículos -->
          @if (activeView() === 'explorer') {
            
            <div class="max-w-6xl mx-auto space-y-8 text-left">
              
              <!-- Título del filtro activo -->
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-slate-800">
                  @if (selectedCategory()) {
                    Artículos en: <span class="text-blue-600">{{ selectedCategory() }}</span>
                  } @else if (searchQuery()) {
                    Resultados de búsqueda para: <span class="text-blue-600">"{{ searchQuery() }}"</span>
                  } @else {
                    Todos los Artículos
                  }
                </h2>
                
                <!-- Botón rápido para escribir -->
                <button 
                  (click)="createNewArticle()"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-black text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
                  </svg>
                  Crear Nuevo Post
                </button>
              </div>

              <!-- Estado Vacío -->
              @if (filteredArticles().length === 0) {
                <div class="bg-white border border-slate-200/60 rounded-2xl p-12 text-center space-y-3 shadow-sm">
                  <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <h3 class="font-bold text-slate-700">No se encontraron artículos</h3>
                  <p class="text-sm text-slate-400 max-w-md mx-auto">No hay publicaciones disponibles bajo la categoría o la consulta de búsqueda solicitada en este momento.</p>
                  <button (click)="resetFilters()" class="text-xs font-bold text-blue-600 hover:underline">Restablecer filtros</button>
                </div>
              } @else {

                <!-- Grid de Artículos -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  @for (art of filteredArticles(); track art.id) {
                    
                    <div 
                      (click)="viewArticle(art)"
                      class="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5">
                      
                      <div>
                        <!-- Portada -->
                        @if (art.coverImage) {
                          <div class="w-full h-44 overflow-hidden relative bg-slate-100">
                            <img [src]="art.coverImage" [alt]="art.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <span class="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                              {{ art.category }}
                            </span>
                          </div>
                        }

                        <!-- Detalles -->
                        <div class="p-5 space-y-3">
                          <span class="text-[10px] font-semibold text-slate-400">{{ art.date }}</span>
                          <h3 class="font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                            {{ art.title }}
                          </h3>
                          
                          <!-- Tags -->
                          @if (art.tags && art.tags.length > 0) {
                            <div class="flex flex-wrap gap-1 pt-1">
                              @for (tag of art.tags; track tag) {
                                <span class="px-2 py-0.5 bg-slate-100 text-[10px] text-slate-500 rounded font-medium">#{{ tag }}</span>
                              }
                            </div>
                          }
                        </div>
                      </div>

                      <!-- Footer del Card: Autor y Gestión -->
                      <div class="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        
                        <!-- Autor -->
                        <div class="flex items-center gap-2">
                          <img [src]="art.author.avatar" alt="Avatar" class="w-7 h-7 rounded-full bg-slate-100" />
                          <span class="text-xs font-semibold text-slate-600 line-clamp-1">{{ art.author.name }}</span>
                        </div>

                        <!-- Botones de administración -->
                        <div class="flex items-center gap-1.5">
                          <!-- Editar -->
                          <button 
                            (click)="editArticle(art, $event)" 
                            class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                            title="Editar artículo">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </button>
                          <!-- Eliminar -->
                          <button 
                            (click)="deleteArticle(art.id, $event)" 
                            class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
                            title="Eliminar artículo">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>

                      </div>

                    </div>

                  }
                </div>

              }
            </div>

          }
          
          <!-- Vista 2: Lector de Artículos -->
          @if (activeView() === 'viewer') {
            <app-blog-render 
              [article]="selectedArticle()!" 
              [relatedArticles]="relatedArticles()"
              (like)="likeArticle($event)"
              (share)="shareArticle($event)"
              (addComment)="addComment($event)"
              (articleSelect)="viewArticle($event)" />
          }

          <!-- Vista 3: Creador/Editor -->
          @if (activeView() === 'editor') {
            <app-blog-editor 
              [article]="selectedArticle()"
              (saved)="onArticleSaved($event)"
              (cancelled)="onEditorCancelled()" />
          }

        </main>

      </div>

    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      margin: 0 !important;
      padding: 0 !important;
      text-align: left !important;
    }
  `
})
export default class HomePage {
  blogService = inject(BlogService);

  // Estados reactivos (Signals)
  activeView = signal<'explorer' | 'editor' | 'viewer'>('explorer');
  selectedCategory = signal<string | null>(null);
  searchQuery = signal<string>('');
  selectedArticle = signal<Article | null>(null);

  // Listado filtrado reactivo
  filteredArticles = computed(() => {
    let list = this.blogService.articles();

    // Filtro de categoría
    const category = this.selectedCategory();
    if (category) {
      list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    // Filtro de buscador (Título o Etiquetas)
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(a => 
        a.title.toLowerCase().includes(query) || 
        (a.tags && a.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    return list;
  });

  // Artículos relacionados reactivos basados en el seleccionado
  relatedArticles = computed(() => {
    const art = this.selectedArticle();
    if (!art) return [];
    return this.blogService.obtenerArticulosRelacionados(art);
  });

  onCategorySelected(category: string | null) {
    this.selectedCategory.set(category);
    this.searchQuery.set(''); // Resetear búsqueda cuando se hace clic en una categoría
    this.activeView.set('explorer');
  }

  onViewSelected(view: 'explorer' | 'editor' | 'viewer') {
    this.activeView.set(view);
    if (view === 'editor') {
      this.selectedArticle.set(null); // Crear nuevo si no se setea antes
    }
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    // Cambiar a explorer si está en otra vista al escribir en el buscador
    if (this.activeView() !== 'explorer') {
      this.activeView.set('explorer');
    }
  }

  resetFilters() {
    this.selectedCategory.set(null);
    this.searchQuery.set('');
  }

  viewArticle(article: Article) {
    // Para ver el artículo con los datos más actualizados del servicio
    const freshArticle = this.blogService.obtenerArticuloPorId(article.id);
    this.selectedArticle.set(freshArticle || article);
    this.activeView.set('viewer');
    // Scroll al inicio del panel
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  createNewArticle() {
    this.selectedArticle.set(null);
    this.activeView.set('editor');
  }

  editArticle(article: Article, event: Event) {
    event.stopPropagation();
    this.selectedArticle.set(article);
    this.activeView.set('editor');
  }

  deleteArticle(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('¿Estás seguro de que deseas eliminar este artículo permanentemente?')) {
      this.blogService.eliminarArticulo(id);
      if (this.selectedArticle()?.id === id) {
        this.selectedArticle.set(null);
      }
      this.activeView.set('explorer');
    }
  }

  goBack() {
    this.activeView.set('explorer');
    this.selectedArticle.set(null);
  }

  // Acciones en el Lector
  likeArticle(id: string) {
    this.blogService.darMeGusta(id);
    // Actualizar el seleccionado
    const updated = this.blogService.obtenerArticuloPorId(id);
    if (updated) this.selectedArticle.set(updated);
  }

  shareArticle(id: string) {
    this.blogService.compartirArticulo(id);
    const updated = this.blogService.obtenerArticuloPorId(id);
    if (updated) this.selectedArticle.set(updated);
  }

  addComment(event: { articleId: string; author: string; text: string }) {
    this.blogService.agregarComentario(event.articleId, event.author, event.text);
    const updated = this.blogService.obtenerArticuloPorId(event.articleId);
    if (updated) this.selectedArticle.set(updated);
  }

  // Acciones del Editor
  onArticleSaved(article: Article) {
    this.selectedArticle.set(article);
    this.activeView.set('viewer'); // Ir al lector para ver el post guardado
  }

  onEditorCancelled() {
    this.activeView.set('explorer');
    this.selectedArticle.set(null);
  }
}

/* 
 * RESUMEN DEL ARCHIVO:
 * Este archivo es la página principal (la pantalla inicial) de nuestra aplicación.
 * Funciona como el "contenedor" que agrupa la barra de navegación y la lista de artículos.
 * Comparación con Expo: En Expo, esto sería como tu archivo App.js o tu pantalla "Home" principal (un View principal) que renderiza otros componentes hijos dentro de ella.
 */
