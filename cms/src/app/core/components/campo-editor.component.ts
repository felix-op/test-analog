import { Component, afterNextRender, input, OnDestroy } from '@angular/core';
import type { Block } from '@models/block.model';

@Component({
  selector: 'app-campo-editor',
  template: `
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-bold text-slate-600 uppercase tracking-wider">
        {{ label() }}
      </label>

      <div [class]="wrapperClass()">
        <div [id]="holderId" class="px-6 py-4 prose max-w-none text-slate-700 min-h-48"></div>
      </div>

      @if (error()) {
        <p class="text-[11px] font-semibold text-red-500">{{ error() }}</p>
      }
    </div>
  `,
})
export class CampoEditorComponent implements OnDestroy {
  readonly holderId = 'editorjs-holder';

  label = input<string>('Contenido del Artículo');
  initialBlocks = input<Block[]>([]);
  error = input<string>('');

  private editorInstance: any = null;

  constructor() {
    afterNextRender(async () => {
      const { default: EditorJS } = await import('@editorjs/editorjs');
      const { default: Header } = await import('@editorjs/header');
      const { default: List } = await import('@editorjs/list');

      this.editorInstance = new EditorJS({
        holder: this.holderId,
        data: { blocks: this.initialBlocks() },
        tools: {
          header: { class: Header as any, inlineToolbar: true },
          list: { class: List as any, inlineToolbar: true },
        },
        placeholder: 'Haz clic aquí para comenzar a escribir…',
      });
    });
  }

  async getBlocks(): Promise<Block[]> {
    if (!this.editorInstance) return [];
    const output = await this.editorInstance.save();
    return output.blocks as Block[];
  }

  wrapperClass() {
    const base = 'bg-white border rounded-2xl shadow-sm';
    return this.error()
      ? `${base} border-red-300`
      : `${base} border-slate-200`;
  }

  ngOnDestroy() {
    this.editorInstance?.destroy?.();
  }
}
