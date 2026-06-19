import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-button-simple",
  standalone: true,
  imports: [],
  template: `
    <button
      (click)="onClick.emit()"
      [disabled]="disabled()"
      class="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonSimpleComponent {
  disabled = input<boolean>(false);
  onClick = output<void>();
}
