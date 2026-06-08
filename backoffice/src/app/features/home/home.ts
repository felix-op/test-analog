import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenCardComponent } from '@components/resumen-card/resumen-card';
import type { ResumenCard } from '@models/resumen-card.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ResumenCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  tarjetas: ResumenCard[] = [
    {
      id: 'ventas',
      titulo: 'Ventas del día',
      valor: 273,
      descripcion: '10% más que la semana pasada',
      icono: 'shopping_cart',
      tendencia: 10,
      colorTendencia: 'success',
    },
    {
      id: 'pedidos',
      titulo: 'Pedidos pendientes',
      valor: 12,
      descripcion: '2% menos que el promedio',
      icono: 'assignment',
      tendencia: -2,
      colorTendencia: 'warning',
    },
    {
      id: 'clientes',
      titulo: 'Clientes activos',
      valor: 1240,
      descripcion: '5% más que el mes anterior',
      icono: 'people',
      tendencia: 5,
      colorTendencia: 'success',
    },
    {
      id: 'ingresos',
      titulo: 'Ingresos totales',
      valor: '$15,240',
      descripcion: '8% más que el periodo anterior',
      icono: 'trending_up',
      tendencia: 8,
      colorTendencia: 'success',
    },
  ];
}
