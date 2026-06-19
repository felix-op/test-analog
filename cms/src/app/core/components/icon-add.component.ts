import { Component } from "@angular/core";

@Component({
  selector: "app-icon-add",
  standalone: true,
  imports: [],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-3.5 h-3.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5H4.5"
      />
    </svg>
  `,
})
export class IconAddComponent {}
