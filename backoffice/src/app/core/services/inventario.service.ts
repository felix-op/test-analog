import { Injectable, signal } from '@angular/core';
import type { InventarioItem } from '@models/inventario-item.model';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private readonly STORAGE_KEY = 'backoffice_productos';

  private readonly productosSemilla: InventarioItem[] = [
    {
      id: 'espresso',
      estado: 'activo',
      producto: 'Espresso',
      categoria: 'Cafés calientes',
      precio: 1800,
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'agua-filtrada', nombre: 'Agua filtrada', cantidad: 45, unidad: 'ml' },
      ],
    },
    {
      id: 'latte',
      estado: 'activo',
      producto: 'Latte',
      categoria: 'Cafés con leche',
      precio: 2600,
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'leche-entera', nombre: 'Leche entera', cantidad: 180, unidad: 'ml' },
      ],
    },
    {
      id: 'mocca',
      estado: 'en revisión',
      producto: 'Mocca',
      categoria: 'Cafés saborizados',
      precio: 3300,
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'leche-entera', nombre: 'Leche entera', cantidad: 160, unidad: 'ml' },
        { ingredienteId: 'chocolate-amargo', nombre: 'Chocolate amargo', cantidad: 25, unidad: 'g' },
      ],
    },
    {
      id: 'capuccino',
      estado: 'activo',
      producto: 'Capuccino',
      categoria: 'Cafés con leche',
      precio: 2800,
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'leche-entera', nombre: 'Leche entera', cantidad: 150, unidad: 'ml' },
        { ingredienteId: 'cacao-polvo', nombre: 'Cacao en polvo', cantidad: 3, unidad: 'g' },
      ],
    },
    {
      id: 'flat-white',
      estado: 'activo',
      producto: 'Flat white',
      categoria: 'Cafés con leche',
      precio: 2900,
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 20, unidad: 'g' },
        { ingredienteId: 'leche-entera', nombre: 'Leche entera', cantidad: 130, unidad: 'ml' },
      ],
    },
    {
      id: 'cold-brew',
      estado: 'inactivo',
      producto: 'Cold brew',
      categoria: 'Cafés fríos',
      precio: 3100,
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 28, unidad: 'g' },
        { ingredienteId: 'agua-filtrada', nombre: 'Agua filtrada', cantidad: 220, unidad: 'ml' },
        { ingredienteId: 'hielo', nombre: 'Hielo', cantidad: 120, unidad: 'g' },
      ],
    },
    {
      id: 'vainilla-latte',
      estado: 'en revisión',
      producto: 'Latte de vainilla',
      categoria: 'Cafés saborizados',
      precio: 3200,
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'leche-entera', nombre: 'Leche entera', cantidad: 170, unidad: 'ml' },
        { ingredienteId: 'jarabe-vainilla', nombre: 'Jarabe de vainilla', cantidad: 20, unidad: 'ml' },
      ],
    },
    {
      id: 'americano',
      estado: 'activo',
      producto: 'Americano',
      categoria: 'Cafés calientes',
      precio: 2100,
      ingredientes: [
        { ingredienteId: 'granos-cafe-arabica', nombre: 'Granos de café arábica', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'agua-filtrada', nombre: 'Agua filtrada', cantidad: 140, unidad: 'ml' },
      ],
    },
    {
      id: 'croissant-jamon-queso',
      estado: 'inactivo',
      producto: 'Croissant jamón y queso',
      categoria: 'Sandwiches',
      precio: 3900,
      ingredientes: [
        { ingredienteId: 'croissant', nombre: 'Croissant', cantidad: 1, unidad: 'u' },
        { ingredienteId: 'jamon-cocido', nombre: 'Jamón cocido', cantidad: 40, unidad: 'g' },
        { ingredienteId: 'queso-barra', nombre: 'Queso barra', cantidad: 40, unidad: 'g' },
      ],
    },
    {
      id: 'medialuna',
      estado: 'activo',
      producto: 'Medialuna de manteca',
      categoria: 'Pastelería',
      precio: 1200,
      ingredientes: [
        { ingredienteId: 'harina-0000', nombre: 'Harina 0000', cantidad: 45, unidad: 'g' },
        { ingredienteId: 'manteca', nombre: 'Manteca', cantidad: 18, unidad: 'g' },
        { ingredienteId: 'azucar', nombre: 'Azúcar', cantidad: 8, unidad: 'g' },
      ],
    },
    {
      id: 'tostado-jamon-queso',
      estado: 'inactivo',
      producto: 'Tostado jamón y queso',
      categoria: 'Sandwiches',
      precio: 3600,
      ingredientes: [
        { ingredienteId: 'pan-molde', nombre: 'Pan de molde', cantidad: 2, unidad: 'u' },
        { ingredienteId: 'jamon-cocido', nombre: 'Jamón cocido', cantidad: 45, unidad: 'g' },
        { ingredienteId: 'queso-barra', nombre: 'Queso barra', cantidad: 45, unidad: 'g' },
      ],
    },
  ];

  private readonly productosSignal = signal<InventarioItem[]>(this.cargarProductos());

  readonly productos = this.productosSignal.asReadonly();

  obtenerProductosCriticos(): InventarioItem[] {
    return this.productosSignal()
      .filter((producto) => producto.estado === 'inactivo' || producto.estado === 'en revisión')
      .sort((a, b) => this.getPrioridadEstado(b.estado) - this.getPrioridadEstado(a.estado));
  }

  contarPorEstado(estado: InventarioItem['estado']): number {
    return this.productosSignal().filter((producto) => producto.estado === estado).length;
  }

  agregarProducto(producto: Omit<InventarioItem, 'id'>): void {
    const nuevoProducto: InventarioItem = {
      ...producto,
      id: this.generarId(producto.producto),
    };

    this.guardarProductos([nuevoProducto, ...this.productosSignal()]);
  }

  actualizarProducto(producto: InventarioItem): void {
    const actualizados = this.productosSignal().map((item) => (item.id === producto.id ? producto : item));
    this.guardarProductos(actualizados);
  }

  eliminarProducto(id: string): void {
    this.guardarProductos(this.productosSignal().filter((producto) => producto.id !== id));
  }

  private getPrioridadEstado(estado: InventarioItem['estado']): number {
    if (estado === 'inactivo') return 2;
    if (estado === 'en revisión') return 1;
    return 0;
  }

  private cargarProductos(): InventarioItem[] {
    if (typeof window === 'undefined') {
      return this.productosSemilla;
    }

    const almacenados = localStorage.getItem(this.STORAGE_KEY);

    if (!almacenados) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.productosSemilla));
      return this.productosSemilla;
    }

    try {
      const productos = JSON.parse(almacenados) as Partial<InventarioItem>[];
      const migrados = productos.map((producto) => this.normalizarProducto(producto));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(migrados));
      return migrados;
    } catch {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.productosSemilla));
      return this.productosSemilla;
    }
  }

  private normalizarProducto(producto: Partial<InventarioItem>): InventarioItem {
    return {
      id: producto.id || this.generarId(producto.producto || 'producto'),
      estado: this.normalizarEstado(producto.estado),
      producto: producto.producto || 'Producto sin nombre',
      categoria: producto.categoria || 'Sin categoría',
      precio: producto.precio || 0,
      ingredientes: producto.ingredientes || [],
    };
  }

  private normalizarEstado(estado: unknown): InventarioItem['estado'] {
    if (estado === 'inactivo' || estado === 'pausado' || estado === 'sin stock') return 'inactivo';
    if (estado === 'en revisión' || estado === 'requiere revisión' || estado === 'bajo stock') return 'en revisión';
    return 'activo';
  }

  private guardarProductos(productos: InventarioItem[]): void {
    this.productosSignal.set(productos);

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(productos));
    }
  }

  private generarId(nombre: string): string {
    const base = nombre
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return `${base || 'producto'}-${Date.now()}`;
  }
}
