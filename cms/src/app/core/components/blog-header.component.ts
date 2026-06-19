import { Component, computed, inject } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, startWith } from "rxjs";
import { IconSearchComponent } from "./icon-search.component";
import { IconArrowLeftComponent } from "./icon-arrow-left.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-blog-header",
  standalone: true,
  imports: [IconSearchComponent, IconArrowLeftComponent, FormsModule],
  template: `
    <header
      class="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-sm/5"
    >
      <!-- Botón de retorno o título según la ruta -->
      <div class="flex items-center gap-3">
        @if (!isIndexRoute()) {
          <button
            (click)="goBack()"
            class="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors cursor-pointer group"
          >
            <app-icon-arrow-left />
            Volver al Explorador
          </button>
        } @else {
          <div>
            <h2 class="text-base font-extrabold text-slate-900 tracking-tight">
              Portal Editorial
            </h2>
            <p class="text-[11px] text-slate-400 font-medium">
              Gestión y lectura de artículos de la comunidad
            </p>
          </div>
        }
      </div>

      <!-- Buscador por temas y título -->
      <div class="relative w-72">
        <span
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
        >
          <app-icon-search />
        </span>
        <input
          type="text"
          [ngModel]="searchQuery()"
          (ngModelChange)="onSearch($event)"
          placeholder="Buscar noticias o temas relacionados..."
          class="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
        />
      </div>
    </header>
  `,
})
export class BlogHeaderComponent {
  private readonly router = inject(Router);

  private readonly queryParams = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.parseUrl(this.router.url).queryParams),
      startWith(this.router.parseUrl(this.router.url).queryParams),
    ),
  );

  readonly isIndexRoute = computed(
    () => this.router.url.split("?")[0] === "/blog/explorer",
  );

  readonly searchQuery = computed(
    () => (this.queryParams()?.["searchQuery"] as string) ?? "",
  );

  onSearch(value: string) {
    this.router.navigate(["/blog/explorer"], {
      queryParams: { searchQuery: value || undefined },
      queryParamsHandling: "merge",
    });
  }

  goBack() {
    this.router.navigate(["/blog/explorer"]);
  }
}
