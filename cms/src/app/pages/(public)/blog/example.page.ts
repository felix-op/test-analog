import { Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectLoad } from '@analogjs/router';
import { LoadResult } from '@analogjs/router';

import { load } from './example.server'; // no incluido en la compilación del cliente

@Component({
  standalone: true,
  template: `
    <h2>Ejemplo con SSR</h2>

    <!-- Con Signals utilizando inyect se puede acceder así -->
    <!-- Es la única forma si no tenemos withComponentInputBinding() -->
    <!--
        Loaded: {{ data().loaded }}
        Contenido: {{ data().contenido }}
    -->

    <!-- Con withComponentInputBinding() -->
    Loaded: {{ data.loaded }}
    Contenido: {{ data.contenido }}
  `,
})
export default class ExampleComponent {
  //data = toSignal(injectLoad<typeof load>(), { requireSync: true });

  @Input() set load(data: LoadResult<typeof load>) {
    console.log('ExampleComponent load input:', data);
    this.data = data;
  }

  data!: LoadResult<typeof load>;
}