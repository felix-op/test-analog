import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InventarioTableComponent } from './components/inventario-table/inventario-table';
import { InventarioService } from '@core/services/inventario.service';
import type { InventarioEstado, InventarioItem } from '@models/inventario-item.model';

type FiltroInventario = 'todos' | 'disponible' | 'bajo stock' | 'sin stock';

@Component({
  selector: 'app-inventario-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    InventarioTableComponent,
  ],
  templateUrl: './inventario.html',
  styleUrl: './inventario.scss',
})
export class InventarioPage {
  private readonly inventarioService = inject(InventarioService);

  busqueda = signal('');
  filtroActivo = signal<FiltroInventario>('todos');

  filtros: { id: FiltroInventario; label: string; icon: string }[] = [
    { id: 'todos', label: 'Ver todos', icon: 'inventory_2' },
    { id: 'disponible', label: 'Disponibles', icon: 'check_circle' },
    { id: 'bajo stock', label: 'Bajo stock', icon: 'error' },
    { id: 'sin stock', label: 'Sin stock', icon: 'remove_shopping_cart' },
  ];

  inventario: InventarioItem[] = this.inventarioService.obtenerProductos();

  productosBajoStock = computed(() => {
    return this.inventarioService.contarPorEstado('bajo stock');
  });

  productosSinStock = computed(() => {
    return this.inventarioService.contarPorEstado('sin stock');
  });

  inventarioFiltrado = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();
    const filtro = this.filtroActivo();

    return this.inventario.filter((item) => {
      const coincideBusqueda =
        item.producto.toLowerCase().includes(termino) ||
        item.categoria.toLowerCase().includes(termino) ||
        item.estado.toLowerCase().includes(termino) ||
        item.ingredientes.some((ingrediente) => ingrediente.nombre.toLowerCase().includes(termino));

      const coincideFiltro = filtro === 'todos' || this.coincideEstadoFiltro(item.estado, filtro);

      return coincideBusqueda && coincideFiltro;
    });
  });

  setBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  setFiltro(filtro: FiltroInventario): void {
    this.filtroActivo.set(filtro);
  }

  private coincideEstadoFiltro(estado: InventarioEstado, filtro: FiltroInventario): boolean {
    if (filtro === 'disponible') {
      return estado === 'disponible' || estado === 'bajo stock';
    }

    return estado === filtro;
  }
}
