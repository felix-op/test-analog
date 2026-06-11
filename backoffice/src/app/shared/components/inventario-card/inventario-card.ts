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
      case 'faltante':
        return 'estado-faltante';
      case 'ingredientes faltantes':
      case 'limite compra':
        return 'estado-warning';
      case 'disponible':
        return 'estado-disponible';
      default:
        return 'estado-neutral';
    }
  }

  getShellClass(): string {
    return this.getEstadoClass();
  }

  getProgress(): number {
    const max = 300;
    return Math.min(100, Math.round((this.card.cantidadDisponible / max) * 100));
  }
}
