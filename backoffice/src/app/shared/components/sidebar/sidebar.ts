import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatIcon, MatNavList],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  logout(): void {
    // Lógica para limpiar tokens / destruir sesión
    console.log('Session destroyed');
  }
}