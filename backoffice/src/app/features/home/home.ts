import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenCardComponent } from '@components/resumen-card/resumen-card';
import { IngredienteCardComponent } from '@components/ingrediente-card/ingrediente-card';
import { InventarioCardComponent } from '@components/inventario-card/inventario-card';
import { InventarioService } from '@core/services/inventario.service';
import type { ResumenCard } from '@models/resumen-card.model';
import type { IngredienteCard } from '@models/ingrediente-card.model';
import type { InventarioCard } from '@models/inventario-card.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ResumenCardComponent, IngredienteCardComponent, InventarioCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  private readonly inventarioService = inject(InventarioService);

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

  ingredientes: IngredienteCard[] = [
    {
      id: 'granos-cafe-java',
      nombre: 'Granos de Café Java',
      cantidadDisponible: 25,
      cantidadMaxima: 300,
      estado: 'faltante',
    },
    {
      id: 'azucar',
      nombre: 'Azúcar',
      cantidadDisponible: 79,
      cantidadMaxima: 400,
      estado: 'limite vencimiento',
    },
    {
      id: 'leche',
      nombre: 'Leche',
      cantidadDisponible: 290,
      cantidadMaxima: 100,
      estado: 'disponible',
    },
  ];

  inventario = computed<InventarioCard[]>(() =>
    this.inventarioService
      .productos()
      .filter((producto) => producto.estado === 'inactivo' || producto.estado === 'en revisión')
      .sort((a, b) => this.getPrioridadEstado(b.estado) - this.getPrioridadEstado(a.estado))
      .map((producto) => ({
        id: producto.id,
        nombre: producto.producto,
        categoria: producto.categoria,
        estado: producto.estado,
      })),
  );

  private getPrioridadEstado(estado: InventarioCard['estado']): number {
    if (estado === 'inactivo') return 2;
    if (estado === 'en revisión') return 1;
    return 0;
  }
}
