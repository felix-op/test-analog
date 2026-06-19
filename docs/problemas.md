# Problemas encontrados en la documentación de Analog



## Obtener datos del servidor
Link: https://analogjs.org/es/docs/features/data-fetching/server-side-data-fetching

Este ejemplo:
```js
// src/app/pages/index.page.ts
import { Component } from '@angular/core';
import { LoadResult } from '@analogjs/router';

import { load } from './index.server'; // no incluido en la compilación del cliente

@Component({
  standalone: true,
  template: `
    <h2>Inicio</h2>
    Loaded: {{ data.loaded }}
  `,
})
export default class BlogComponent {
  @Input() load(data: LoadResult<typeof load>) {
    this.data = data;
  }

  data!: LoadResult<typeof load>;
}
```

Tiene un error en esta parte:
```js
@Input() load(data: LoadResult<typeof load>)
```

Ejemplo funcional:
```js
@Input() set load(data: LoadResult<typeof load>)
```

