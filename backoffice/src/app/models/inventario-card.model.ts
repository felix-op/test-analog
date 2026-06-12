export interface InventarioCard {
  id: string;
  nombre: string;
  categoria: string;
  estado: 'activo' | 'en revisión' | 'inactivo';
}
