import { Component } from "@angular/core";

@Component({
  selector: "app-icon-arrow-left",
  standalone: true,
  imports: [],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2.5"
      stroke="currentColor"
      class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
      />
    </svg>
  `,
})
export class IconArrowLeftComponent {}
