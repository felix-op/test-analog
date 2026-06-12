export type IngredienteEstado = 'disponible' | 'bajo stock' | 'sin stock' | 'por vencer';

export interface IngredienteItem {
  id: string;
  nombre: string;
  categoria: string;
  cantidadDisponible: number;
  cantidadMaxima: number;
  unidad: string;
  fechaVencimiento: string;
  proveedor: string;
  estado: IngredienteEstado;
}
