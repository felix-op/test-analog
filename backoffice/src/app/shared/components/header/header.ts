import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIcon, MatToolbarModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private themeService = inject(ThemeService);
  theme = this.themeService.theme;

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

