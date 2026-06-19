import { Component, computed, effect, inject, input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ArticlesService } from "@services/articles.service";
import { Article } from "@models/article.model";
import { ButtonAddComponent } from "@components/button-add.component";
import { ButtonEditComponent } from "@components/button-edit.component";
import { ButtonDeleteComponent } from "@components/button-delete.component";
import { ButtonSimpleComponent } from "@components/button-simple.component";
import { IconInfoComponent } from "@components/icon-info.component";
import { IconChevronDownComponent } from "@components/icon-chevron-down.component";

@Component({
  selector: "app-explorer",
  standalone: true,
  imports: [
    RouterLink,
    ButtonAddComponent,
    ButtonEditComponent,
    ButtonDeleteComponent,
    ButtonSimpleComponent,
    IconInfoComponent,
    IconChevronDownComponent,
  ],
  template: `
    <div class="max-w-6xl mx-auto space-y-8 text-left">

      <!-- Encabezado del explorador -->
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-slate-800">
          @if (selectedCategory()) {
            Artículos en:
            <span class="text-blue-600">{{ selectedCategory() }}</span>
          } @else if (searchQuery()) {
            Resultados de búsqueda para:
            <span class="text-blue-600">"{{ searchQuery() }}"</span>
          } @else {
            Todos los Artículos
          }
        </h2>

        <app-button-add (onClick)="onCreateArticle()" />
      </div>

      <!-- Estado de carga inicial -->
      @if (service.loading() && service.articles().length === 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (i of skeletons; track i) {
            <div class="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div class="w-full h-44 bg-slate-100 animate-pulse"></div>
              <div class="p-5 space-y-3">
                <div class="h-3 w-16 bg-slate-100 rounded animate-pulse"></div>
                <div class="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                <div class="h-4 w-3/4 bg-slate-100 rounded animate-pulse"></div>
              </div>
              <div class="px-5 py-4 border-t border-slate-100 flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-slate-100 animate-pulse"></div>
                <div class="h-3 w-24 bg-slate-100 rounded animate-pulse"></div>
              </div>
            </div>
          }
        </div>

      <!-- Estado Vacío -->
      } @else if (service.paginatedArticles().length === 0) {
        <div
          class="bg-white border border-slate-200/60 rounded-2xl p-12 text-center space-y-3 shadow-sm"
        >
          <div
            class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400"
          >
            <app-icon-info />
          </div>
          <h3 class="font-bold text-slate-700">No se encontraron artículos</h3>
          <p class="text-sm text-slate-400 max-w-md mx-auto">
            No hay publicaciones disponibles bajo la categoría o consulta de
            búsqueda solicitada en este momento.
          </p>
          <button
            (click)="service.filterByTag(null)"
            class="text-xs font-bold text-blue-600 hover:underline"
          >
            Restablecer filtros
          </button>
        </div>
      } @else {

        <!-- Grid de Artículos -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (art of service.paginatedArticles(); track art.id) {
            <div
              [routerLink]="['/blog/article', art.id]"
              class="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
            >
              <div>
                <!-- Portada -->
                @if (art.coverImage) {
                  <div class="w-full h-44 overflow-hidden relative bg-slate-100">
                    <img
                      [src]="art.coverImage"
                      [alt]="art.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      class="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-md uppercase tracking-wider"
                    >
                      {{ art.category }}
                    </span>
                  </div>
                }

                <!-- Detalles -->
                <div class="p-5 space-y-3">
                  <span class="text-[10px] font-semibold text-slate-400">{{ art.date }}</span>
                  <h3
                    class="font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors"
                  >
                    {{ art.title }}
                  </h3>

                  <!-- Tags -->
                  @if (art.tags && art.tags.length > 0) {
                    <div class="flex flex-wrap gap-1 pt-1">
                      @for (tag of art.tags; track tag) {
                        <span
                          class="px-2 py-0.5 bg-slate-100 text-[10px] text-slate-500 rounded font-medium"
                        >#{{ tag }}</span>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Footer: Autor y Acciones -->
              <div
                class="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <img
                    [src]="art.author.avatar"
                    alt="Avatar"
                    class="w-7 h-7 rounded-full bg-slate-100"
                  />
                  <span class="text-xs font-semibold text-slate-600 line-clamp-1">
                    {{ art.author.name }}
                  </span>
                </div>

                <div class="flex items-center gap-1.5">
                  <app-button-edit (onClick)="onUpdateArticle(art)" />
                  <app-button-delete (onClick)="service.deleteArticle(art.id)" />
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Cargar Más -->
        @if (service.hasMore()) {
          <div class="flex justify-center pt-8">
            <app-button-simple
              [disabled]="service.loading()"
              (onClick)="service.getMoreArticles()"
            >
              @if (service.loading()) {
                <svg
                  class="animate-spin h-4 w-4 text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando artículos...
              } @else {
                <app-icon-chevron-down />
                Cargar más artículos
              }
            </app-button-simple>
          </div>
        } @else {
          <div class="text-center pt-8 text-xs font-semibold text-slate-400 tracking-wide">
            Has llegado al final. Todos los artículos cargados de la API.
          </div>
        }

      }
    </div>
  `,
})
export default class ExplorerPage {
  protected readonly service = inject(ArticlesService);
  private readonly router = inject(Router);
  readonly skeletons = Array(6).fill(0);

  selectedCategory = input<string | null>(null);
  searchQuery = input<string>("");

  constructor() {
    effect(() => {
      this.service.filterByTag(this.selectedCategory());
      this.service.setSearchQuery(this.searchQuery());
    });
  }

  onCreateArticle(): void {
    this.router.navigate(['/blog/article-editor']);
  }

  onUpdateArticle(article: Article): void {
    this.router.navigate(['/blog/article-editor'], {
      queryParams: { articleId: article.id },
    });
  }
}
