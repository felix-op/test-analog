import { Component, input, output } from "@angular/core";
import { IconAddComponent } from "./icon-add.component";

@Component({
  selector: "app-button-add",
  standalone: true,
  imports: [IconAddComponent],
  template: `
    <button
      (click)="onClick.emit()"
      class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
    >
      <app-icon-add />
      {{ label() }}
    </button>
  `,
})
export class ButtonAddComponent {
  label = input<string>("Crear Nuevo Post");
  onClick = output<void>();
}
