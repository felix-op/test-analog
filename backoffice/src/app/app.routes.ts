import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomePage } from './features/home/home';
import { InventarioPage } from './features/inventario/inventario';
import { IngredientesPage } from './features/ingredientes/ingredientes';

@Component({
  standalone: true,
  template: `
    <div style="padding: 20px; border: 2px dashed var(--mat-sys-outline); border-radius: 8px;">
      <h1 style="color: var(--mat-sys-primary);">Vista Temporal</h1>
      <p>Esta página aún está en desarrollo.</p>
    </div>
  `
})
class MockComponent {}

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },

    // Rutas principales (Superiores)
    { path: 'inicio', component: HomePage },
    { path: 'inventario', component: InventarioPage },
    { path: 'ingredientes', component: IngredientesPage },
    { path: 'proveedores', component: MockComponent },
    { path: 'soporte', component: MockComponent },
    { path: 'configuracion', component: MockComponent }
];
