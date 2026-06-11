import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: `
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }
  `,
})
export class App {}

/* 
 * RESUMEN DEL ARCHIVO:
 * Este es el componente raíz de la aplicación web. Actúa como el punto de entrada principal donde se inyectan y muestran las demás pantallas según la ruta de navegación (usando <router-outlet>).
 * Comparación con Expo: En Expo, sería equivalente al archivo principal (generalmente App.js o App.tsx) que retorna tu enrutador principal (ej. un Stack.Navigator).
 */
