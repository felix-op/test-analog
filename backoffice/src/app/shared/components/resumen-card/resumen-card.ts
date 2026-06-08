import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import type { ResumenCard } from '@models/resumen-card.model';

@Component({
  selector: 'app-resumen-card',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './resumen-card.html',
  styleUrl: './resumen-card.scss',
})
export class ResumenCardComponent {
  @Input() card!: ResumenCard;

  getTendenciaClass(): string {
    if (this.card.tendencia > 0) return 'tendencia-positiva';
    if (this.card.tendencia < 0) return 'tendencia-negativa';
    return 'tendencia-neutra';
  }

  getTendenciaIcon(): string {
    if (this.card.tendencia > 0) return 'trending_up';
    if (this.card.tendencia < 0) return 'trending_down';
    return 'trending_flat';
  }
}
