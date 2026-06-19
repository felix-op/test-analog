import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

// Para agregar metadatos a una ruta se puede hacer con:

// export const routeMeta: RouteMeta = {
//   title: 'About Analog',
//   canActivate: [() => true],
//   providers: [AboutService],
// };

// Si quieres hacer una redirección a otra ruta
// Por ejemplo: '/' -> '/home'

// export const routeMeta: RouteMeta = {
//   redirectTo: '/home',
//   pathMatch: 'full',
// };

// También se pueden definir metatag de html
// Por ejemplo:
// <meta http-equiv="refresh" content="30">
// Más metatags en
// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta

// export const routeMeta: RouteMeta = {
//   title: 'Refresh every 30 sec',
//   meta: [
//     {
//       httpEquiv: 'refresh',
//       content: '30',
//     },
//   ],
// };

export const routeMeta: RouteMeta = {
   meta: [
    {
      name: 'description',
      content: 'Description of the page',
    },
    {
      name: 'author',
      content: 'Analog Team',
    },
    {
      property: 'og:title',
      content: 'Title of the page',
    },
    {
      property: 'og:description',
      content: 'Some catchy description',
    },
    {
      property: 'og:image',
      content: 'https://somepage.com/someimage.png',
    },
  ],
}

@Component({
  selector: 'app-blog-layout',
  imports: [RouterOutlet],
  template: `
    <h2>Layout</h2>

    <router-outlet></router-outlet>
  `,
})
export default class BlogLayout {
  //private readonly service = inject(BlogService);
}
