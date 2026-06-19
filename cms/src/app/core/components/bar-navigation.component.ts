import { Component, computed, inject, input, output } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { NavigationEnd, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, startWith } from "rxjs";
import { IconAnalogComponent } from "./icon-analog.component";
import { BarNavegationItemComponent } from "./bar-navigation-item.component";
import { IconHomeComponent } from "./icon-home.component";
import { IconEditComponent } from "./icon-edit.component";
import { IconHelpComponent } from "./icon-help.component";
import { IconChevronDownComponent } from "./icon-chevron-down.component";
import { BarNavegationCategoryComponent } from "./bar-navigation-category.component";

/*
 * Barra de navegación que contiene las categorías.
 * Permite filtrar los artículos según los temas relacionados.
 */
@Component({
  selector: "app-bar-navegation",
  standalone: true,
  imports: [
    IconAnalogComponent,
    IconHomeComponent,
    BarNavegationItemComponent,
    IconEditComponent,
    IconHelpComponent,
    IconChevronDownComponent,
    BarNavegationCategoryComponent,
  ],
  template: `
    <div
      class="h-full flex flex-col justify-between py-6 px-4 bg-slate-50 border-r border-slate-200"
    >
      <!-- Sección Superior: Logo y Navegación Principal -->
      <div class="space-y-8 flex flex-col min-h-0">
        <!-- Logo -->
        <div class="flex items-center gap-3 px-2 shrink-0">
          <div
            class="w-9 h-9 rounded-xl bg-white-600 flex items-center justify-center text-white shadow-xs shadow-red-500"
          >
            <app-icon-analog />
          </div>
          <span
            class="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
          >
            Analog Blog
          </span>
        </div>

        <!-- Navegación Principal -->
        <nav class="flex flex-col space-y-1.5 shrink-0">
          <app-bar-navegation-item link="/blog/explorer">
            <app-icon-home />
            <span>Inicio / Explorador</span>
          </app-bar-navegation-item>

          @if (authService.isAuthenticated()) {
            <app-bar-navegation-item link="/blog/article-editor">
              <app-icon-edit />
              <span>Escribir Artículo</span>
            </app-bar-navegation-item>
          }
        </nav>

        <hr class="border-slate-200 my-4 shrink-0" />

        <!-- Categorías (dinámicas desde la API) -->
        <section class="flex flex-col min-h-0 flex-1">
          <span
            class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 shrink-0"
          >
            Categorías
          </span>

          <!-- Lista scrollable de categorías -->
          <div
            class="overflow-y-auto flex-1 space-y-1 pr-1"
            style="max-height: 280px;"
          >
            @for (cat of categories(); track cat) {
              <app-bar-navegation-category
                [label]="cat"
                [active]="activeCategory() === cat"
                (onClick)="selectCategory(cat)"
              />
            }

            <!-- Indicador de carga -->
            @if (loadingCategories()) {
              <div class="flex items-center justify-center py-3">
                <div
                  class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                ></div>
              </div>
            }
          </div>

          <!-- Botón "Cargar más categorías" con flecha -->
          @if (hasMoreCategories() && !loadingCategories()) {
            <button
              (click)="loadMoreCategoriesRequested.emit()"
              class="w-full flex items-center justify-center gap-2 mt-2 py-2 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 shrink-0 group cursor-pointer"
            >
              <span>Más categorías</span>
              <app-icon-chevron-down />
            </button>
          }
        </section>
      </div>

      <!-- Sección Inferior: Soporte e Información -->
      <div class="space-y-1 shrink-0">
        <button
          (click)="abrirAyuda()"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200 text-left text-sm group cursor-pointer"
        >
          <app-icon-help />
          <span>Soporte y Ayuda</span>
        </button>
        <div class="text-[10px] text-slate-400 px-3 mt-4 text-center">
          © 2026 Headway Blog App.
        </div>
      </div>
    </div>
  `,
})
export class BarNavegacionComponent {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  categories = input<string[]>([]);
  hasMoreCategories = input<boolean>(true);
  loadingCategories = input<boolean>(false);
  loadMoreCategoriesRequested = output<void>();

  private readonly queryParams = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.parseUrl(this.router.url).queryParams),
      startWith(this.router.parseUrl(this.router.url).queryParams),
    ),
  );

  readonly activeCategory = computed(
    () => (this.queryParams()?.["selectedCategory"] as string) ?? null,
  );

  selectCategory(category: string) {
    const next = this.activeCategory() === category ? undefined : category;
    this.router.navigate(["/blog/explorer"], {
      queryParams: { selectedCategory: next },
      queryParamsHandling: "merge",
    });
  }

  abrirAyuda() {
    alert(
      "Sistema de Ayuda y Soporte\n\nEste blog de demostración te permite explorar artículos de DEV.to filtrados por categorías.\nUtiliza las categorías de la barra lateral para filtrar el contenido.",
    );
  }
}
