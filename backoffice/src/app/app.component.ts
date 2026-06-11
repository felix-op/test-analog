import { Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@components/header/header';
import { SidebarComponent } from "@components/sidebar/sidebar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, HeaderComponent, SidebarComponent],
  template: `
    <app-header (toggleSidebar)="sidenav.toggle()"></app-header>

    <mat-sidenav-container class="main-container">
      
      <mat-sidenav #sidenav mode="side" opened class="sidebar">
        <app-sidebar></app-sidebar>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styles: `
  :host {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  /* El contenedor ocupa el espacio restante debajo del header */
  .main-container {
    flex: 1;
    width: 100%;
  }

  .sidebar {
    width: 240px;
    box-sizing: border-box;
    padding: 16px;
    border-right: 1px solid var(--mat-sys-outline-variant);
    border-radius: 0px;
    background: var(--mat-sys-surface-container);
  }

  .content {
    padding: 24px;
    box-sizing: border-box;
  }
  `,
})
export class App {
  protected readonly title = signal('backoffice');
}
