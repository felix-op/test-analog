import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { IngredienteItem } from '@models/ingrediente-item.model';

@Component({
  selector: 'app-ingredientes-table',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './ingredientes-table.html',
  styleUrl: './ingredientes-table.scss',
})
export class IngredientesTableComponent {
  @Input() items: IngredienteItem[] = [];
  @Output() editar = new EventEmitter<IngredienteItem>();
  @Output() eliminar = new EventEmitter<string>();

  getPorcentaje(item: IngredienteItem): number {
    return Math.min(100, Math.round((item.cantidadDisponible / item.cantidadMaxima) * 100));
  }

  getEstadoClass(item: IngredienteItem): string {
    switch (item.estado) {
      case 'disponible':
        return 'estado-disponible';
      case 'bajo stock':
      case 'por vencer':
        return 'estado-warning';
      case 'sin stock':
        return 'estado-faltante';
      default:
        return 'estado-neutral';
    }
  }

  editarIngrediente(item: IngredienteItem): void {
    this.editar.emit(item);
  }

  eliminarIngrediente(id: string): void {
    this.eliminar.emit(id);
  }
}
