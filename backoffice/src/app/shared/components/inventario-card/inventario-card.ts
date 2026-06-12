import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import type { InventarioCard } from '@models/inventario-card.model';

@Component({
  selector: 'app-inventario-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './inventario-card.html',
  styleUrl: './inventario-card.scss',
})
export class InventarioCardComponent {
  @Input() card!: InventarioCard;

  getEstadoClass(): string {
    switch (this.card.estado) {
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

  getShellClass(): string {
    return this.getEstadoClass();
  }
}
