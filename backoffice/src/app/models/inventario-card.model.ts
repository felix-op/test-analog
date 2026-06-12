export interface InventarioCard {
  id: string;
  nombre: string;
  cantidadDisponible: number;
  cantidadMaxima: number;
  estado: 'disponible' | 'bajo stock' | 'sin stock';
}
