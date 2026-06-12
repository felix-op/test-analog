import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IngredientesService } from '@core/services/ingredientes.service';
import type { IngredienteEstado, IngredienteItem } from '@models/ingrediente-item.model';
import { IngredientesTableComponent } from './components/ingredientes-table/ingredientes-table';

type FiltroIngredientes = 'todos' | IngredienteEstado;

@Component({
  selector: 'app-ingredientes-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    IngredientesTableComponent,
  ],
  templateUrl: './ingredientes.html',
  styleUrl: './ingredientes.scss',
})
export class IngredientesPage {
  private readonly ingredientesService = inject(IngredientesService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  busqueda = signal('');
  filtroActivo = signal<FiltroIngredientes>('todos');
  formularioAbierto = signal(false);
  ingredienteEditando = signal<IngredienteItem | null>(null);

  ingredientes = this.ingredientesService.ingredientes;

  filtros: { id: FiltroIngredientes; label: string; icon: string }[] = [
    { id: 'todos', label: 'Ver todos', icon: 'inventory_2' },
    { id: 'disponible', label: 'Disponibles', icon: 'check_circle' },
    { id: 'bajo stock', label: 'Bajo stock', icon: 'error' },
    { id: 'por vencer', label: 'Por vencer', icon: 'schedule' },
    { id: 'sin stock', label: 'Sin stock', icon: 'remove_shopping_cart' },
  ];

  categorias = ['Café', 'Lácteos', 'Saborizantes', 'Panadería', 'Sandwiches', 'Packaging'];
  unidades = ['kg', 'g', 'l', 'ml', 'u'];

  ingredienteForm = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    categoria: ['Café', [Validators.required]],
    cantidadDisponible: [0, [Validators.required, Validators.min(0)]],
    cantidadMaxima: [1, [Validators.required, Validators.min(1)]],
    unidad: ['kg', [Validators.required]],
    fechaVencimiento: ['', [Validators.required]],
    proveedor: ['', [Validators.required]],
  });

  ingredientesBajoStock = computed(() => this.ingredientesService.contarPorEstado('bajo stock'));
  ingredientesPorVencer = computed(() => this.ingredientesService.contarPorEstado('por vencer'));
  ingredientesSinStock = computed(() => this.ingredientesService.contarPorEstado('sin stock'));
  ingredientesDisponibles = computed(() => this.ingredientesService.contarPorEstado('disponible'));

  ingredientesFiltrados = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();
    const filtro = this.filtroActivo();

    return this.ingredientes().filter((ingrediente) => {
      const coincideBusqueda =
        ingrediente.nombre.toLowerCase().includes(termino) ||
        ingrediente.categoria.toLowerCase().includes(termino) ||
        ingrediente.estado.toLowerCase().includes(termino) ||
        ingrediente.proveedor.toLowerCase().includes(termino);

      const coincideFiltro = filtro === 'todos' || ingrediente.estado === filtro;

      return coincideBusqueda && coincideFiltro;
    });
  });

  setBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  setFiltro(filtro: FiltroIngredientes): void {
    this.filtroActivo.set(filtro);
  }

  abrirFormulario(): void {
    this.ingredienteEditando.set(null);
    this.ingredienteForm.reset({
      nombre: '',
      categoria: 'Café',
      cantidadDisponible: 0,
      cantidadMaxima: 1,
      unidad: 'kg',
      fechaVencimiento: new Date().toLocaleDateString('es-AR'),
      proveedor: '',
    });
    this.formularioAbierto.set(true);
  }

  editarIngrediente(ingrediente: IngredienteItem): void {
    this.ingredienteEditando.set(ingrediente);
    this.ingredienteForm.reset({
      nombre: ingrediente.nombre,
      categoria: ingrediente.categoria,
      cantidadDisponible: ingrediente.cantidadDisponible,
      cantidadMaxima: ingrediente.cantidadMaxima,
      unidad: ingrediente.unidad,
      fechaVencimiento: ingrediente.fechaVencimiento,
      proveedor: ingrediente.proveedor,
    });
    this.formularioAbierto.set(true);
  }

  guardarIngrediente(): void {
    if (this.ingredienteForm.invalid) {
      this.ingredienteForm.markAllAsTouched();
      return;
    }

    const formValue = this.ingredienteForm.getRawValue();
    const ingredienteBase = {
      nombre: formValue.nombre.trim(),
      categoria: formValue.categoria,
      cantidadDisponible: formValue.cantidadDisponible,
      cantidadMaxima: formValue.cantidadMaxima,
      unidad: formValue.unidad,
      fechaVencimiento: formValue.fechaVencimiento.trim(),
      proveedor: formValue.proveedor.trim(),
    };

    const ingredienteEditando = this.ingredienteEditando();

    if (ingredienteEditando) {
      this.ingredientesService.actualizarIngrediente({
        ...ingredienteEditando,
        ...ingredienteBase,
      });
    } else {
      this.ingredientesService.agregarIngrediente(ingredienteBase);
    }

    this.cerrarFormulario();
  }

  eliminarIngrediente(id: string): void {
    if (!confirm('¿Eliminar este ingrediente?')) {
      return;
    }

    this.ingredientesService.eliminarIngrediente(id);
  }

  cerrarFormulario(): void {
    this.formularioAbierto.set(false);
    this.ingredienteEditando.set(null);
  }
}
