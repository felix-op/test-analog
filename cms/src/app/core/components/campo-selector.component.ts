import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-campo-selector',
  template: `
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-bold text-slate-600">
        {{ label() }}
        @if (!required()) {
          <span class="font-normal text-slate-400">(opcional)</span>
        }
      </label>

      <select
        [value]="value()"
        (change)="value.set(val($event))"
        [class]="selectClass()"
      >
        <option value="" disabled>{{ placeholder() }}</option>
        @for (option of options(); track option) {
          <option [value]="option">{{ option }}</option>
        }
      </select>

      @if (error()) {
        <p class="text-[11px] font-semibold text-red-500">{{ error() }}</p>
      }
    </div>
  `,
})
export class CampoSelectorComponent {
  label = input.required<string>();
  options = input.required<string[]>();
  placeholder = input<string>('Seleccioná una opción');
  required = input<boolean>(false);
  error = input<string>('');

  value = model<string>('');

  val(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  selectClass() {
    const base =
      'w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 transition-colors';
    return this.error()
      ? `${base} border-red-300 focus:ring-red-400 focus:border-red-400`
      : `${base} border-slate-200 focus:ring-blue-500 focus:border-blue-500`;
  }
}
