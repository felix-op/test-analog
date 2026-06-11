import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import type { IngredienteCard } from '@models/ingrediente-card.model';

@Component({
  selector: 'app-ingrediente-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './ingrediente-card.html',
  styleUrl: './ingrediente-card.scss',
})
export class IngredienteCardComponent {
  @Input() card!: IngredienteCard;

  getEstadoClass(): string {
    switch (this.card.estado) {
      case 'faltante':
        return 'estado-faltante';
      case 'limite compra':
      case 'limite vencimiento':
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
