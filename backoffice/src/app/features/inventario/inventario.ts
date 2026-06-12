import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InventarioTableComponent } from './components/inventario-table/inventario-table';
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
  busqueda = signal('');
  filtroActivo = signal<FiltroInventario>('todos');

  filtros: { id: FiltroInventario; label: string; icon: string }[] = [
    { id: 'todos', label: 'Ver todos', icon: 'inventory_2' },
    { id: 'disponible', label: 'Disponibles', icon: 'check_circle' },
    { id: 'bajo stock', label: 'Bajo stock', icon: 'error' },
    { id: 'sin stock', label: 'Sin stock', icon: 'remove_shopping_cart' },
  ];

  inventario: InventarioItem[] = [
    {
      id: 'espresso',
      estado: 'bajo stock',
      producto: 'Espresso',
      categoria: 'Cafés calientes',
      precio: 1800,
      cantidadDisponible: 16,
      cantidadMaxima: 80,
      unidad: 'u',
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'agua-filtrada', nombre: 'Agua filtrada', cantidad: 45, unidad: 'ml' },
      ],
    },
    {
      id: 'latte',
      estado: 'disponible',
      producto: 'Latte',
      categoria: 'Cafés con leche',
      precio: 2600,
      cantidadDisponible: 54,
      cantidadMaxima: 80,
      unidad: 'u',
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'leche-entera', nombre: 'Leche entera', cantidad: 180, unidad: 'ml' },
      ],
    },
    {
      id: 'mocca',
      estado: 'sin stock',
      producto: 'Mocca',
      categoria: 'Cafés saborizados',
      precio: 3300,
      cantidadDisponible: 0,
      cantidadMaxima: 55,
      unidad: 'u',
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'leche-entera', nombre: 'Leche entera', cantidad: 160, unidad: 'ml' },
        { ingredienteId: 'chocolate-amargo', nombre: 'Chocolate amargo', cantidad: 25, unidad: 'g' },
      ],
    },
    {
      id: 'capuccino',
      estado: 'disponible',
      producto: 'Capuccino',
      categoria: 'Cafés con leche',
      precio: 2800,
      cantidadDisponible: 47,
      cantidadMaxima: 70,
      unidad: 'u',
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'leche-entera', nombre: 'Leche entera', cantidad: 150, unidad: 'ml' },
        { ingredienteId: 'cacao-polvo', nombre: 'Cacao en polvo', cantidad: 3, unidad: 'g' },
      ],
    },
    {
      id: 'flat-white',
      estado: 'disponible',
      producto: 'Flat white',
      categoria: 'Cafés con leche',
      precio: 2900,
      cantidadDisponible: 41,
      cantidadMaxima: 70,
      unidad: 'u',
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 20, unidad: 'g' },
        { ingredienteId: 'leche-entera', nombre: 'Leche entera', cantidad: 130, unidad: 'ml' },
      ],
    },
    {
      id: 'cold-brew',
      estado: 'sin stock',
      producto: 'Cold brew',
      categoria: 'Cafés fríos',
      precio: 3100,
      cantidadDisponible: 0,
      cantidadMaxima: 45,
      unidad: 'u',
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 28, unidad: 'g' },
        { ingredienteId: 'agua-filtrada', nombre: 'Agua filtrada', cantidad: 220, unidad: 'ml' },
        { ingredienteId: 'hielo', nombre: 'Hielo', cantidad: 120, unidad: 'g' },
      ],
    },
    {
      id: 'vainilla-latte',
      estado: 'bajo stock',
      producto: 'Latte de vainilla',
      categoria: 'Cafés saborizados',
      precio: 3200,
      cantidadDisponible: 9,
      cantidadMaxima: 60,
      unidad: 'u',
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'leche-entera', nombre: 'Leche entera', cantidad: 170, unidad: 'ml' },
        { ingredienteId: 'jarabe-vainilla', nombre: 'Jarabe de vainilla', cantidad: 20, unidad: 'ml' },
      ],
    },
    {
      id: 'americano',
      estado: 'disponible',
      producto: 'Americano',
      categoria: 'Cafés calientes',
      precio: 2100,
      cantidadDisponible: 63,
      cantidadMaxima: 90,
      unidad: 'u',
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'agua-filtrada', nombre: 'Agua filtrada', cantidad: 140, unidad: 'ml' },
      ],
    },
    {
      id: 'croissant-jamon-queso',
      estado: 'sin stock',
      producto: 'Croissant jamón y queso',
      categoria: 'Sandwiches',
      precio: 3900,
      cantidadDisponible: 0,
      cantidadMaxima: 30,
      unidad: 'u',
      ingredientes: [
        { ingredienteId: 'croissant', nombre: 'Croissant', cantidad: 1, unidad: 'u' },
        { ingredienteId: 'jamon-cocido', nombre: 'Jamón cocido', cantidad: 40, unidad: 'g' },
        { ingredienteId: 'queso-barra', nombre: 'Queso barra', cantidad: 40, unidad: 'g' },
      ],
    },
    {
      id: 'medialuna',
      estado: 'disponible',
      producto: 'Medialuna de manteca',
      categoria: 'Pastelería',
      precio: 1200,
      cantidadDisponible: 32,
      cantidadMaxima: 50,
      unidad: 'u',
      ingredientes: [
        { ingredienteId: 'harina-0000', nombre: 'Harina 0000', cantidad: 45, unidad: 'g' },
        { ingredienteId: 'manteca', nombre: 'Manteca', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'azucar', nombre: 'Azúcar', cantidad: 8, unidad: 'g' },
      ],
    },
    {
      id: 'tostado-jamon-queso',
      estado: 'sin stock',
      producto: 'Tostado jamón y queso',
      categoria: 'Sandwiches',
      precio: 3600,
      cantidadDisponible: 0,
      cantidadMaxima: 35,
      unidad: 'u',
      ingredientes: [
        { ingredienteId: 'pan-molde', nombre: 'Pan de molde', cantidad: 2, unidad: 'u' },
        { ingredienteId: 'jamon-cocido', nombre: 'Jamón cocido', cantidad: 45, unidad: 'g' },
        { ingredienteId: 'queso-barra', nombre: 'Queso barra', cantidad: 45, unidad: 'g' },
      ],
    },
  ];

  productosBajoStock = computed(() => {
    return this.inventario.filter((item) => item.estado === 'bajo stock').length;
  });

  productosSinStock = computed(() => {
    return this.inventario.filter((item) => item.estado === 'sin stock').length;
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
