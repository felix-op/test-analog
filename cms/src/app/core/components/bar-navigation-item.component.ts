import { NgClass } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-bar-navegation-item",
  standalone: true,
  template: `
    <a
        #rla="routerLinkActive"
        [routerLink]="link()"
        routerLinkActive="bg-white text-red-600 shadow-sm border-slate-200/50 font-semibold"
        [routerLinkActiveOptions]="{ exact: true }"
        [ngClass]="{
            'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900': !rla.isActive,
        }"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left text-sm group cursor-pointer outline-none border border-transparent"
    >
        <ng-content></ng-content>
    </a>
  `,
  imports: [NgClass, RouterLink, RouterLinkActive],
})
export class BarNavegationItemComponent {
    link = input<string>("/");
    onClick = output<void>();
}
