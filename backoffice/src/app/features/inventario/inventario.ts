import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InventarioTableComponent } from './components/inventario-table/inventario-table';
import { InventarioService } from '@core/services/inventario.service';
import type { IngredienteProducto, InventarioEstado, InventarioItem } from '@models/inventario-item.model';

type FiltroInventario = 'todos' | 'activo' | 'en revisión' | 'inactivo';

@Component({
  selector: 'app-inventario-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    InventarioTableComponent,
  ],
  templateUrl: './inventario.html',
  styleUrl: './inventario.scss',
})
export class InventarioPage {
  private readonly inventarioService = inject(InventarioService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  busqueda = signal('');
  filtroActivo = signal<FiltroInventario>('todos');
  formularioAbierto = signal(false);
  productoEditando = signal<InventarioItem | null>(null);

  filtros: { id: FiltroInventario; label: string; icon: string }[] = [
    { id: 'todos', label: 'Ver todos', icon: 'inventory_2' },
    { id: 'activo', label: 'Activos', icon: 'check_circle' },
    { id: 'en revisión', label: 'En revisión', icon: 'error' },
    { id: 'inactivo', label: 'Inactivos', icon: 'pause_circle' },
  ];

  inventario = this.inventarioService.productos;

  productoForm = this.formBuilder.group({
    producto: ['', [Validators.required]],
    categoria: ['Cafés calientes', [Validators.required]],
    estado: ['activo' as InventarioEstado, [Validators.required]],
    precio: [0, [Validators.required, Validators.min(1)]],
    ingredientes: ['', [Validators.required]],
  });

  categorias = ['Cafés calientes', 'Cafés con leche', 'Cafés saborizados', 'Cafés fríos', 'Pastelería', 'Sandwiches'];
  estados: InventarioEstado[] = ['activo', 'en revisión', 'inactivo'];

  productosEnRevision = computed(() => {
    return this.inventarioService.contarPorEstado('en revisión');
  });

  productosInactivos = computed(() => {
    return this.inventarioService.contarPorEstado('inactivo');
  });

  inventarioFiltrado = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();
    const filtro = this.filtroActivo();

    return this.inventario().filter((item) => {
      const coincideBusqueda =
        item.producto.toLowerCase().includes(termino) ||
        item.categoria.toLowerCase().includes(termino) ||
        item.estado.toLowerCase().includes(termino) ||
        item.ingredientes.some((ingrediente) => ingrediente.nombre.toLowerCase().includes(termino));

      const coincideFiltro = filtro === 'todos' || this.coincideEstadoFiltro(item.estado, filtro);

      return coincideBusqueda && coincideFiltro;
    });
  });

  setBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  setFiltro(filtro: FiltroInventario): void {
    this.filtroActivo.set(filtro);
  }

  abrirFormulario(): void {
    this.productoEditando.set(null);
    this.productoForm.reset({
      producto: '',
      categoria: 'Cafés calientes',
      estado: 'activo',
      precio: 0,
      ingredientes: '',
    });
    this.formularioAbierto.set(true);
  }

  editarProducto(producto: InventarioItem): void {
    this.productoEditando.set(producto);
    this.productoForm.reset({
      producto: producto.producto,
      categoria: producto.categoria,
      estado: producto.estado,
      precio: producto.precio,
      ingredientes: this.ingredientesATexto(producto.ingredientes),
    });
    this.formularioAbierto.set(true);
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const formValue = this.productoForm.getRawValue();
    const productoBase = {
      producto: formValue.producto.trim(),
      categoria: formValue.categoria,
      estado: formValue.estado,
      precio: formValue.precio,
      ingredientes: this.parsearIngredientes(formValue.ingredientes),
    };

    const productoEditando = this.productoEditando();

    if (productoEditando) {
      this.inventarioService.actualizarProducto({
        ...productoEditando,
        ...productoBase,
      });
    } else {
      this.inventarioService.agregarProducto(productoBase);
    }

    this.cerrarFormulario();
  }

  eliminarProducto(id: string): void {
    if (!confirm('¿Eliminar este producto del inventario?')) {
      return;
    }

    this.inventarioService.eliminarProducto(id);
  }

  cerrarFormulario(): void {
    this.formularioAbierto.set(false);
    this.productoEditando.set(null);
  }

  private coincideEstadoFiltro(estado: InventarioEstado, filtro: FiltroInventario): boolean {
    return estado === filtro;
  }

  private parsearIngredientes(valor: string): IngredienteProducto[] {
    return valor
      .split(',')
      .map((ingrediente) => ingrediente.trim())
      .filter(Boolean)
      .map((nombre) => ({
        ingredienteId: this.generarIngredienteId(nombre),
        nombre,
        cantidad: 1,
        unidad: 'u',
      }));
  }

  private ingredientesATexto(ingredientes: IngredienteProducto[]): string {
    return ingredientes.map((ingrediente) => ingrediente.nombre).join(', ');
  }

  private generarIngredienteId(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
