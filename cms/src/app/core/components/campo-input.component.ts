import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-campo-input',
  template: `
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-bold text-slate-600">
        {{ label() }}
        @if (!required()) {
          <span class="font-normal text-slate-400">(opcional)</span>
        }
      </label>

      <input
        [type]="type()"
        [value]="value()"
        [placeholder]="placeholder()"
        (input)="value.set(val($event))"
        [class]="inputClass()"
      />

      @if (error()) {
        <p class="text-[11px] font-semibold text-red-500">{{ error() }}</p>
      }
    </div>
  `,
})
export class CampoInputComponent {
  label = input.required<string>();
  placeholder = input<string>('');
  type = input<'text' | 'url' | 'email'>('text');
  required = input<boolean>(false);
  error = input<string>('');

  value = model<string>('');

  val(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  inputClass() {
    const base =
      'w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 transition-colors';
    return this.error()
      ? `${base} border-red-300 focus:ring-red-400 focus:border-red-400`
      : `${base} border-slate-200 focus:ring-blue-500 focus:border-blue-500`;
  }
}
