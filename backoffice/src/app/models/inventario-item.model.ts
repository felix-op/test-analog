export type InventarioEstado = 'disponible' | 'bajo stock' | 'sin stock';

export interface IngredienteProducto {
  ingredienteId: string;
  nombre: string;
  cantidad: number;
  unidad: string;
}

export interface InventarioItem {
  id: string;
  estado: InventarioEstado;
  producto: string;
  categoria: string;
  precio: number;
  cantidadDisponible: number;
  cantidadMaxima: number;
  unidad: string;
  ingredientes: IngredienteProducto[];
}
