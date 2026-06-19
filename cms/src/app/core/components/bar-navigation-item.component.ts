import { NgClass } from "@angular/common";
import { Component, input, output } from "@angular/core"

@Component({
  selector: "app-bar-navegation-item",
  standalone: true,
  template: `
    <button
        (click)="onClick.emit('explorer')"
        [ngClass]="{
            'bg-white text-red-600 shadow-sm border border-slate-200/50 font-semibold': active(),
            'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900': !active(),
        }"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left text-sm group"
    >
        <ng-content></ng-content>
    </button>
  `,
  imports: [NgClass],
})
export class BarNavegationItemComponent {
    active = input<boolean>(false);
    content = input<string>("Click me!");
    onClick = output<string>();
}
