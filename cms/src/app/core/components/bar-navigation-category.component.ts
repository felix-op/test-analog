import { Component, input, output } from "@angular/core";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-bar-navegation-category",
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      (click)="onClick.emit()"
      [ngClass]="{
        'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 pl-2.5': active(),
        'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900 border-l-2 border-transparent pl-2.5': !active(),
      }"
      class="w-full text-left py-2 text-sm transition-all duration-150 rounded-r-lg"
    >
      {{ label() }}
    </button>
  `,
})
export class BarNavegationCategoryComponent {
  label = input.required<string>();
  active = input<boolean>(false);
  onClick = output<void>();
}
