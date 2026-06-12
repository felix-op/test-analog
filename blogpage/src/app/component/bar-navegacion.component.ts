import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-bar-navegacion',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="h-full flex flex-col justify-between py-6 px-4 bg-slate-50 border-r border-slate-200">
      
      <!-- Sección Superior: Logo y Navegación Principal -->
      <div class="space-y-8 flex flex-col min-h-0">
        
        <!-- Logo -->
        <div class="flex items-center gap-3 px-2 shrink-0">
          <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <!-- Icono Headway -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
            </svg>
          </div>
          <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Headway</span>
        </div>

        <!-- Navegación Principal -->
        <nav class="space-y-1.5 shrink-0">
          <!-- Botón Dashboard / Inicio -->
          <button 
            (click)="selectView('explorer')"
            [ngClass]="{
              'bg-white text-blue-600 shadow-sm border border-slate-200/50 font-semibold': activeView() === 'explorer' && activeCategory() === null,
              'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900': activeView() !== 'explorer' || activeCategory() !== null
            }"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left text-sm group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5 transition-transform duration-200 group-hover:scale-105">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span>Inicio / Explorador</span>
          </button>

          <!-- Botón Escribir Artículo -->
          <button 
            (click)="selectView('editor')"
            [ngClass]="{
              'bg-white text-blue-600 shadow-sm border border-slate-200/50 font-semibold': activeView() === 'editor',
              'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900': activeView() !== 'editor'
            }"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left text-sm group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5 transition-transform duration-200 group-hover:scale-105">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            <span>Escribir Artículo</span>
          </button>
        </nav>

        <hr class="border-slate-200 my-4 shrink-0" />

        <!-- Categorías (dinámicas desde la API) -->
        <div class="flex flex-col min-h-0 flex-1">
          <span class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 shrink-0">Categorías</span>
          
          <!-- Lista scrollable de categorías -->
          <div class="overflow-y-auto flex-1 space-y-1 pr-1" style="max-height: 280px;">
            @for (cat of categories(); track cat) {
              <button 
                (click)="selectCategory(cat)"
                [ngClass]="{
                  'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 pl-2.5': activeCategory() === cat && activeView() === 'explorer',
                  'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900 border-l-2 border-transparent pl-2.5': activeCategory() !== cat || activeView() !== 'explorer'
                }"
                class="w-full text-left py-2 text-sm transition-all duration-150 rounded-r-lg">
                {{ cat }}
              </button>
            }

            <!-- Indicador de carga -->
            @if (loadingCategories()) {
              <div class="flex items-center justify-center py-3">
                <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          </div>

          <!-- Botón "Cargar más categorías" con flecha -->
          @if (hasMoreCategories() && !loadingCategories()) {
            <button 
              (click)="loadMoreCategories()"
              class="w-full flex items-center justify-center gap-2 mt-2 py-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 shrink-0 group">
              <span>Más categorías</span>
              <!-- Flecha abajo -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          }
        </div>

      </div>

      <!-- Sección Inferior: Soporte e Información -->
      <div class="space-y-1 shrink-0">
        <button 
          (click)="abrirAyuda()"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200 text-left text-sm group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5 group-hover:rotate-12 transition-transform">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
          <span>Soporte y Ayuda</span>
        </button>
        <div class="text-[10px] text-slate-400 px-3 mt-4 text-center">
          © 2026 Headway Blog App.
        </div>
      </div>

    </div>
  `
})
export class BarNavegacionComponent {
  // Inputs usando la API de Signal Inputs (Angular 17+)
  activeCategory = input<string | null>(null);
  activeView = input<'explorer' | 'editor' | 'viewer'>('explorer');
  categories = input<string[]>([]);
  hasMoreCategories = input<boolean>(true);
  loadingCategories = input<boolean>(false);

  // Outputs usando output() API
  categorySelected = output<string | null>();
  viewSelected = output<'explorer' | 'editor' | 'viewer'>();
  loadMoreCategoriesRequested = output<void>();

  selectCategory(category: string) {
    this.categorySelected.emit(category);
    this.viewSelected.emit('explorer');
  }

  selectView(view: 'explorer' | 'editor' | 'viewer') {
    if (view === 'explorer') {
      this.categorySelected.emit(null);
    }
    this.viewSelected.emit(view);
  }

  loadMoreCategories() {
    this.loadMoreCategoriesRequested.emit();
  }

  abrirAyuda() {
    alert('Sistema de Ayuda y Soporte\n\nEste blog de demostración te permite explorar artículos de DEV.to filtrados por categorías.\nUtiliza las categorías de la barra lateral para filtrar el contenido.');
  }
}

/* 
 * RESUMEN DEL ARCHIVO:
 * Este archivo crea la barra de navegación que contiene las categorías.
 * Su función principal es permitir al usuario filtrar los artículos según los temas relacionados.
 * Comparación con Expo: En Expo, esto podría ser un componente personalizado de "Tabs" o un <ScrollView horizontal> con botones (TouchableOpacity) que al presionarlos actualizan el estado global para filtrar la lista de artículos mostrada en la pantalla principal.
 */
