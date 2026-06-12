export type InventarioEstado = 'activo' | 'en revisión' | 'inactivo';

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
  ingredientes: IngredienteProducto[];
}
