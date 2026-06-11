export interface InventarioCard {
  id: string;
  nombre: string;
  cantidadDisponible: number;
  cantidadMaxima: number;
  estado: 'faltante' | 'ingredientes faltantes' | 'limite compra' | 'disponible';
}
