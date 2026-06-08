export interface ResumenCard {
  id: string;
  titulo: string;
  valor: number | string;
  descripcion: string;
  icono: string;
  tendencia: number; // Porcentaje de cambio positivo o negativo
  colorTendencia?: 'success' | 'warning' | 'error'; // Verde, amarillo, rojo
}
