export interface IngredienteCard {
  id: string;
  nombre: string;
  cantidadDisponible: number;
  cantidadMaxima: number;
  estado: 'faltante' | 'limite vencimiento' | 'limite compra' | 'disponible';
}
