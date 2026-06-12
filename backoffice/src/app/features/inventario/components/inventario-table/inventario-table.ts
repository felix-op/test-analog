import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { InventarioItem } from '@models/inventario-item.model';

@Component({
  selector: 'app-inventario-table',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './inventario-table.html',
  styleUrl: './inventario-table.scss',
})
export class InventarioTableComponent {
  @Input() items: InventarioItem[] = [];

  getPorcentaje(item: InventarioItem): number {
    return Math.round((item.cantidadDisponible / item.cantidadMaxima) * 100);
  }

  getEstadoClass(item: InventarioItem): string {
    switch (item.estado) {
      case 'disponible':
        return 'estado-disponible';
      case 'bajo stock':
      case 'sin stock':
        return 'estado-faltante';
      default:
        return 'estado-neutral';
    }
  }

  getIngredientesPreview(item: InventarioItem): string {
    return item.ingredientes.map((ingrediente) => ingrediente.nombre).join(', ');
  }
}
