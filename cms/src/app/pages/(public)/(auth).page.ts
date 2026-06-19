import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <h2>Layout</h2>

    <router-outlet></router-outlet>
  `,
})
export default class AuthLayout {}
