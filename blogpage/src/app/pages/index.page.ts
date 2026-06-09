import { Component } from '@angular/core';

import { BlogEditorComponent } from '../component/blog-editor.component';

@Component({ //Esto es una pantalla/componente
  standalone: true,

  imports: [BlogEditorComponent],

  template: ` <!-- TODO: ES UN COMENTARIO EN HTML, ES LO MAS PARECIDO AL RETURN EN NEXT-->
    <app-blog-editor />
  `
})
//Default export es necesario para AnalogJS para saber que esta es la pantalla principal.
export default class HomePage {}
