import { Injectable } from '@angular/core';
import type { InventarioItem } from '@models/inventario-item.model';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private readonly productos: InventarioItem[] = [
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

  obtenerProductos(): InventarioItem[] {
    return this.productos;
  }

  obtenerProductosCriticos(): InventarioItem[] {
    return this.productos
      .filter((producto) => producto.estado === 'sin stock' || producto.estado === 'bajo stock')
      .sort((a, b) => this.getPrioridadEstado(b.estado) - this.getPrioridadEstado(a.estado));
  }

  contarPorEstado(estado: InventarioItem['estado']): number {
    return this.productos.filter((producto) => producto.estado === estado).length;
  }

  private getPrioridadEstado(estado: InventarioItem['estado']): number {
    if (estado === 'sin stock') return 2;
    if (estado === 'bajo stock') return 1;
    return 0;
  }
}
