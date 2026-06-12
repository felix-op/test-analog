import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { InventarioItem } from '@models/inventario-item.model';

@Component({
  selector: 'app-inventario-table',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './inventario-table.html',
  styleUrl: './inventario-table.scss',
})
export class InventarioTableComponent {
  @Input() items: InventarioItem[] = [];
  @Output() editar = new EventEmitter<InventarioItem>();
  @Output() eliminar = new EventEmitter<string>();

  getEstadoClass(item: InventarioItem): string {
    switch (item.estado) {
      case 'activo':
        return 'estado-disponible';
      case 'en revisión':
        return 'estado-warning';
      case 'inactivo':
        return 'estado-faltante';
      default:
        return 'estado-neutral';
    }
  }

  getIngredientesPreview(item: InventarioItem): string {
    return item.ingredientes.map((ingrediente) => ingrediente.nombre).join(', ');
  }

  editarProducto(item: InventarioItem): void {
    this.editar.emit(item);
  }

  eliminarProducto(id: string): void {
    this.eliminar.emit(id);
  }
}
