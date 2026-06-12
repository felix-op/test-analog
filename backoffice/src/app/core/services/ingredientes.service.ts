import { Injectable, signal } from '@angular/core';
import type { IngredienteEstado, IngredienteItem } from '@models/ingrediente-item.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientesService {
  private readonly STORAGE_KEY = 'backoffice_ingredientes';

  private readonly ingredientesSemilla: IngredienteItem[] = [
    {
      id: 'granos-cafe-arabica',
      nombre: 'Granos de café arábica',
      categoria: 'Café',
      cantidadDisponible: 18,
      cantidadMaxima: 120,
      unidad: 'kg',
      fechaVencimiento: '30/09/2024',
      proveedor: 'Tostadores del Sur',
      estado: 'bajo stock',
    },
    {
      id: 'leche-entera',
      nombre: 'Leche entera',
      categoria: 'Lácteos',
      cantidadDisponible: 0,
      cantidadMaxima: 80,
      unidad: 'l',
      fechaVencimiento: '16/07/2024',
      proveedor: 'Lácteos Patagonia',
      estado: 'sin stock',
    },
    {
      id: 'leche-almendra',
      nombre: 'Leche de almendra',
      categoria: 'Lácteos',
      cantidadDisponible: 22,
      cantidadMaxima: 50,
      unidad: 'l',
      fechaVencimiento: '20/07/2024',
      proveedor: 'Verde Natural',
      estado: 'por vencer',
    },
    {
      id: 'chocolate-amargo',
      nombre: 'Chocolate amargo',
      categoria: 'Saborizantes',
      cantidadDisponible: 14,
      cantidadMaxima: 40,
      unidad: 'kg',
      fechaVencimiento: '15/10/2024',
      proveedor: 'Cacao Austral',
      estado: 'disponible',
    },
    {
      id: 'jarabe-vainilla',
      nombre: 'Jarabe de vainilla',
      categoria: 'Saborizantes',
      cantidadDisponible: 7,
      cantidadMaxima: 48,
      unidad: 'u',
      fechaVencimiento: '22/07/2024',
      proveedor: 'Dulce Origen',
      estado: 'bajo stock',
    },
    {
      id: 'harina-0000',
      nombre: 'Harina 0000',
      categoria: 'Panadería',
      cantidadDisponible: 36,
      cantidadMaxima: 60,
      unidad: 'kg',
      fechaVencimiento: '12/11/2024',
      proveedor: 'Molinos Andinos',
      estado: 'disponible',
    },
    {
      id: 'manteca',
      nombre: 'Manteca',
      categoria: 'Panadería',
      cantidadDisponible: 8,
      cantidadMaxima: 40,
      unidad: 'kg',
      fechaVencimiento: '18/07/2024',
      proveedor: 'Lácteos Patagonia',
      estado: 'por vencer',
    },
    {
      id: 'jamon-cocido',
      nombre: 'Jamón cocido',
      categoria: 'Sandwiches',
      cantidadDisponible: 5,
      cantidadMaxima: 35,
      unidad: 'kg',
      fechaVencimiento: '19/07/2024',
      proveedor: 'Fiambres Ruta 3',
      estado: 'bajo stock',
    },
  ];

  private readonly ingredientesSignal = signal<IngredienteItem[]>(this.cargarIngredientes());

  readonly ingredientes = this.ingredientesSignal.asReadonly();

  contarPorEstado(estado: IngredienteEstado): number {
    return this.ingredientesSignal().filter((ingrediente) => ingrediente.estado === estado).length;
  }

  obtenerIngredientesCriticos(): IngredienteItem[] {
    return this.ingredientesSignal()
      .filter((ingrediente) => ingrediente.estado !== 'disponible')
      .sort((a, b) => this.getPrioridadEstado(b.estado) - this.getPrioridadEstado(a.estado));
  }

  agregarIngrediente(ingrediente: Omit<IngredienteItem, 'id' | 'estado'>): void {
    const nuevoIngrediente: IngredienteItem = {
      ...ingrediente,
      id: this.generarId(ingrediente.nombre),
      estado: this.calcularEstado(ingrediente),
    };

    this.guardarIngredientes([nuevoIngrediente, ...this.ingredientesSignal()]);
  }

  actualizarIngrediente(ingrediente: IngredienteItem): void {
    const actualizado: IngredienteItem = {
      ...ingrediente,
      estado: this.calcularEstado(ingrediente),
    };

    this.guardarIngredientes(
      this.ingredientesSignal().map((item) => (item.id === ingrediente.id ? actualizado : item)),
    );
  }

  eliminarIngrediente(id: string): void {
    this.guardarIngredientes(this.ingredientesSignal().filter((ingrediente) => ingrediente.id !== id));
  }

  private cargarIngredientes(): IngredienteItem[] {
    if (typeof window === 'undefined') {
      return this.ingredientesSemilla;
    }

    const almacenados = localStorage.getItem(this.STORAGE_KEY);

    if (!almacenados) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.ingredientesSemilla));
      return this.ingredientesSemilla;
    }

    try {
      return JSON.parse(almacenados) as IngredienteItem[];
    } catch {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.ingredientesSemilla));
      return this.ingredientesSemilla;
    }
  }

  private guardarIngredientes(ingredientes: IngredienteItem[]): void {
    this.ingredientesSignal.set(ingredientes);

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ingredientes));
    }
  }

  private calcularEstado(ingrediente: Pick<IngredienteItem, 'cantidadDisponible' | 'cantidadMaxima' | 'fechaVencimiento'>): IngredienteEstado {
    if (ingrediente.cantidadDisponible <= 0) return 'sin stock';
    if (this.estaPorVencer(ingrediente.fechaVencimiento)) return 'por vencer';
    if (ingrediente.cantidadDisponible / ingrediente.cantidadMaxima <= 0.25) return 'bajo stock';
    return 'disponible';
  }

  private estaPorVencer(fecha: string): boolean {
    const [dia, mes, anio] = fecha.split('/').map(Number);

    if (!dia || !mes || !anio) {
      return false;
    }

    const vencimiento = new Date(anio, mes - 1, dia).getTime();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diasRestantes = Math.ceil((vencimiento - hoy.getTime()) / (1000 * 60 * 60 * 24));

    return diasRestantes >= 0 && diasRestantes <= 10;
  }

  private getPrioridadEstado(estado: IngredienteEstado): number {
    if (estado === 'sin stock') return 3;
    if (estado === 'por vencer') return 2;
    if (estado === 'bajo stock') return 1;
    return 0;
  }

  private generarId(nombre: string): string {
    const base = nombre
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return `${base || 'ingrediente'}-${Date.now()}`;
  }
}
