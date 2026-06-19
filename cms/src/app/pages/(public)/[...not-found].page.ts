import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
// Esto permite lanzar un 404 directamente al navegador
// import { injectResponse } from '@analogjs/router/tokens';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Page Not Found',
  // Esto permite lanzar un 404 directamente al navegador
  // canActivate: [
  //   () => {
  //     const response = injectResponse();
  //     if (import.meta.env.SSR && response) {
  //       response.statusCode = 404;
  //       response.end();
  //     }
  //     return true;
  //   },
  // ],
};

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Page Not Found</h2>

    <a routerLink="/">Go Back Home</a>
  `,
})
export default class PageNotFoundTab {}